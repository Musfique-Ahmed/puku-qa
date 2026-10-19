#!/usr/bin/env python3
"""Visit each footer link and capture title + status."""
import subprocess, re

URLS = [
    "/puku-editor", "/puku-cli", "/puku-chat", "/puku-app",
    "/pricing", "/docs", "/changelog", "/download", "/blog",
    "/about-us", "/contact", "/support", "/terms", "/privacy", "/refund",
]

results = []
for u in URLS:
    full = "https://web.dev.puku.sh" + u
    p = subprocess.run(
        f'npx --yes @playwright/cli@0.1.22 open "{full}"',
        capture_output=True, text=True, shell=True
    )
    out = p.stdout
    title_m = re.search(r"Page Title:\s*(.+)", out)
    url_m = re.search(r"Page URL:\s*(.+)", out)
    results.append({
        "path": u,
        "url": url_m.group(1) if url_m else "?",
        "title": title_m.group(1).strip() if title_m else "?",
    })
    print(f"{u:20s} -> {title_m.group(1).strip() if title_m else '?'}")

with open("runs/TC-014/walk-result.txt", "w") as f:
    for r in results:
        f.write(f"{r['path']:20s} -> {r['title']}\n")
print("wrote runs/TC-014/walk-result.txt")
