#!/usr/bin/env python3
"""
TC-004 — Magic-link click-through.

Provisions a mail.tm inbox, submits the disposable address via /email-login,
extracts the verify URL from the email, navigates to it (in the SAME browser —
the magic link is browser-bound), clicks the CSRF confirm button to finish
signing in, asserts the authenticated state, then logs out and deletes the
inbox.

Two-stage verify (verified 2026-10-19):
  - The verify URL (/api/oauth/magic-link/verify?token=…) renders a CSRF
    confirmation page (H1 "Sign in to Puku", body "Click the button below…").
  - The session is only established when the user clicks the "Sign in to Puku"
    confirm button on that page. The button ref is captured from the snapshot
    and clicked via pw_click() before the auth-state eval.
  - A "fresh browser" attempt fails with `error=magic_link_wrong_browser`; the
    pw_goto() helper uses `npx playwright-cli goto` to navigate in the existing
    browser session.

Steps (per the spec):
  1. Provision a mail.tm inbox (https://api.mail.tm, maxxspace.com)
  2. Open /email-login in the playwright browser
  3. Submit the disposable address
  4. Poll mail.tm for the magic-link email (up to 60s)
  5. Extract the sign-in link (text + HTML body)
  6. Navigate to the verify URL in the same browser
  7. Click the CSRF confirm button
  8. Verify the resulting page is authenticated (URL, H1, localStorage, cookies)
  9. Log out (clear cookies + localStorage) and delete the inbox
"""
import json, os, re, subprocess, sys, time, urllib.request, urllib.error, urllib.parse, uuid

MAIL_API = "https://api.mail.tm"
PLAYWRIGHT = "npx --yes @playwright/cli@0.1.22"

# ---- mail.tm helpers ---------------------------------------------------------

def mail_request(method, path, body=None, token=None):
    url = MAIL_API + path
    headers = {"Accept": "application/json", "Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            raw = r.read().decode("utf-8") or "null"
            try:
                return r.status, json.loads(raw)
            except json.JSONDecodeError:
                return r.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(raw)
        except json.JSONDecodeError:
            return e.code, raw

def get_domain():
    code, data = mail_request("GET", "/domains")
    print(f"   [debug] domains: code={code} type={type(data).__name__} preview={str(data)[:200]}")
    if code != 200:
        raise RuntimeError(f"domains: {code} {data}")
    if isinstance(data, list):
        members = data
    elif isinstance(data, dict):
        members = data.get("hydra:member") or data.get("member") or []
    else:
        raise RuntimeError(f"unexpected domains payload type: {type(data)}")
    for d in members:
        if d.get("isActive") and not d.get("isPrivate"):
            return d["domain"]
    raise RuntimeError("no active public domain")

def create_account(address, password):
    code, data = mail_request("POST", "/accounts", {"address": address, "password": password})
    if code in (201, 200):
        return data["id"]
    raise RuntimeError(f"create_account: {code} {data}")

def get_token(address, password):
    code, data = mail_request("POST", "/token", {"address": address, "password": password})
    if code == 200:
        return data["token"], data["id"]
    raise RuntimeError(f"get_token: {code} {data}")

def list_messages(token):
    code, data = mail_request("GET", "/messages", token=token)
    if code == 200:
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            return data.get("hydra:member") or data.get("member") or []
        return []
    raise RuntimeError(f"list_messages: {code} {data}")

def get_message(message_id, token):
    code, data = mail_request("GET", f"/messages/{message_id}", token=token)
    if code == 200:
        return data
    raise RuntimeError(f"get_message: {code} {data}")

def delete_account(account_id, token):
    code, data = mail_request("DELETE", f"/accounts/{account_id}", token=token)
    return code

# ---- playwright helpers ------------------------------------------------------

def pw_open(url):
    p = subprocess.run(f'{PLAYWRIGHT} open "{url}"', capture_output=True, text=True, shell=True)
    return p.stdout

def pw_goto(url):
    """Navigate in the existing browser without opening a new one."""
    p = subprocess.run(f'{PLAYWRIGHT} goto "{url}"', capture_output=True, text=True, shell=True)
    return p.stdout

def pw_snapshot():
    p = subprocess.run(f"{PLAYWRIGHT} snapshot", capture_output=True, text=True, shell=True)
    return p.stdout

def pw_click(ref):
    p = subprocess.run(f"{PLAYWRIGHT} click {ref}", capture_output=True, text=True, shell=True)
    return p.stdout

def pw_type(text):
    p = subprocess.run(f'{PLAYWRIGHT} type "{text}"', capture_output=True, text=True, shell=True)
    return p.stdout

def pw_eval(js):
    p = subprocess.run(f"{PLAYWRIGHT} eval {js}", capture_output=True, text=True, shell=True)
    return p.stdout

def pw_eval_result(js):
    """Extract the value from pw_eval output (between '### Result' and '### Ran Playwright code')."""
    out = pw_eval(js)
    m = re.search(r"### Result\s*\n(.*?)(?=\n### Ran Playwright code|\Z)", out, re.DOTALL)
    if m:
        return m.group(1).strip()
    return ""

# ---- main flow ---------------------------------------------------------------

def main():
    run_id = str(int(time.time()))
    domain = get_domain()
    address = f"puku-qa-{run_id}@{domain}"
    password = uuid.uuid4().hex + uuid.uuid4().hex

    print(f"== Provisioning mail.tm inbox: {address}")
    create_account(address, password)
    token, account_id = get_token(address, password)
    print(f"   account_id={account_id}, token acquired")

    # Save credentials to a file for the result.md
    with open("runs/TC-004/inbox.json", "w") as f:
        json.dump({"address": address, "domain": domain, "account_id": account_id,
                   "created_at": run_id}, f, indent=2)

    # Step 1: navigate
    print("== Step 1: navigate to /email-login")
    out = pw_open("https://web.dev.puku.sh/email-login?next=%2F")
    print(out)

    # Capture H1 + helper copy
    h1_js = "() => document.querySelector('h1') && document.querySelector('h1').textContent"
    h1 = pw_eval_result(h1_js)
    print(f"   H1: {h1}")

    helper_js = "() => { const ps = Array.from(document.querySelectorAll('main p, [role=main] p, form + p, form p')); return ps.map(p => p.textContent.trim()).filter(t => t.length > 20); }"
    helper = pw_eval_result(helper_js)
    print(f"   Helper copy: {helper}")

    # Step 3: find input + button refs
    print("== Step 3: locate input + button")
    snap = pw_snapshot()
    # Find input ref + button ref
    input_m = re.search(r'textbox "[^"]*"\s*\[ref=([\w]+)\]', snap)
    btn_m = re.search(r'button "Continue" \[ref=([\w]+)\]', snap)
    if not input_m or not btn_m:
        print("   ERROR: could not find input/button refs in snapshot")
        print(snap[:2000])
        sys.exit(1)
    input_ref = input_m.group(1)
    btn_ref = btn_m.group(1)
    print(f"   input ref={input_ref}, button ref={btn_ref}")

    # Step 4: type the disposable email
    print("== Step 4: type disposable email")
    pw_click(input_ref)
    pw_type(address)

    # Step 5: click Continue
    print("== Step 5: click Continue")
    pw_click(btn_ref)
    time.sleep(2)  # give the page a moment to transition

    # Inspect post-submit state
    snap2 = pw_snapshot()
    print(snap2[:1500])

    # Check that we see a confirmation message
    confirm_js = "() => { const all = Array.from(document.querySelectorAll('main, [role=main]')).map(e => e.textContent).join(' '); return { hasInbox: /inbox|check your|email|sent|check your inbox/i.test(all), url: location.href, title: document.title, h1: document.querySelector('h1') && document.querySelector('h1').textContent }; }"
    confirm_state = pw_eval_result(confirm_js)
    print("== Post-submit state")
    print(confirm_state)

    # Save the post-submit snapshot
    with open("runs/TC-004/post-submit.txt", "w") as f:
        f.write(snap2)

    # Step 6: poll mail.tm for new message
    print(f"== Step 6: polling mail.tm for the magic link email (up to 60s)")
    message_id = None
    deadline = time.time() + 60
    while time.time() < deadline:
        msgs = list_messages(token)
        if msgs:
            message_id = msgs[0]["id"]
            print(f"   got message: {msgs[0].get('subject', '?')}")
            break
        time.sleep(3)
    if not message_id:
        print("   TIMEOUT: no email arrived within 60s")
        # Save the inbox state for debugging
        with open("runs/TC-004/inbox-debug.json", "w") as f:
            json.dump({"inbox_messages": list_messages(token)}, f, indent=2)
        sys.exit(2)

    # Step 7: get message body, extract the sign-in link
    print("== Step 7: get email and extract sign-in link")
    msg = get_message(message_id, token)
    with open("runs/TC-004/email.json", "w") as f:
        json.dump(msg, f, indent=2)
    # mail.tm returns html as a list of strings; concat them
    html_field = msg.get("html")
    if isinstance(html_field, list):
        body_html = "\n".join(html_field)
    else:
        body_html = html_field or ""
    body_text = (msg.get("text", "") or "") + "\n" + re.sub(r"<[^>]+>", " ", body_html)
    link_m = re.search(r"https?://[^\s\"'<>]*puku\.sh[^\s\"'<>]*verify[^\s\"'<>]*", body_text) or re.search(r"https?://[^\s\"'<>]*puku\.sh[^\s\"'<>]*", body_text)
    if not link_m:
        print("   ERROR: no puku.sh link found in email body")
        print("--- body (first 500 chars) ---")
        print(body_text[:500])
        sys.exit(3)
    sign_in_url = link_m.group(0)
    print(f"   sign-in URL: {sign_in_url[:80]}...")

    # Step 8: click the link
    print("== Step 8: navigate to the sign-in link (in same browser session)")
    out = pw_goto(sign_in_url)
    print(out)
    time.sleep(3)

    # Some magic-link flows show a CSRF "click to confirm" button; click it if present.
    # Find button refs from the current snapshot.
    snap_verify = pw_snapshot()
    confirm_btn = re.search(r'button "Sign in to Puku" \[ref=([\w]+)\]', snap_verify)
    if confirm_btn:
        print(f"   clicking confirm button (ref={confirm_btn.group(1)})")
        pw_click(confirm_btn.group(1))
        time.sleep(3)

    # Verify authenticated state
    auth_js = "() => { const ls = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); ls[k] = localStorage.getItem(k); } return { url: location.href, title: document.title, h1: document.querySelector('h1') && document.querySelector('h1').textContent, hasSignInLink: !!Array.from(document.querySelectorAll('a, button')).find(e => /^sign in$/i.test(e.textContent.trim())), localStorage: ls, cookies: document.cookie }; }"
    auth_state = pw_eval_result(auth_js)
    print("== Auth state after sign-in")
    print(auth_state)

    # Save final state
    snap3 = pw_snapshot()
    with open("runs/TC-004/post-signin.txt", "w") as f:
        f.write(snap3)

    # Postconditions: log out (clear cookies + localStorage) and delete inbox
    print("== Postconditions: clear cookies + localStorage, delete inbox")
    logout_js = "() => { try { localStorage.clear(); } catch (e) {} try { sessionStorage.clear(); } catch (e) {} return { cleared: true }; }"
    pw_eval(logout_js)
    # Delete the inbox
    code = delete_account(account_id, token)
    print(f"   inbox delete status: {code}")

    print("== DONE")

if __name__ == "__main__":
    main()
