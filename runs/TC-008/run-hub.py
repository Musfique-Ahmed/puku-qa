#!/usr/bin/env python3
"""Run TC-008 — docs hub — using the existing playwright-cli browser session."""
import json, subprocess, sys, urllib.request, time
from pathlib import Path

# Connect to the running playwright-cli browser via CDP
# playwright-cli opens a chromium with --remote-debugging-port=9222 by default
def cdp_eval(js_expr):
    """Evaluate JS in the page via the playwright session."""
    # We use a sub-process call to playwright-cli eval by passing JS via stdin
    # -- Actually, just call npx playwright-cli eval with the script content via stdin
    p = subprocess.run(
        ["npx", "--yes", "@playwright/cli@0.1.22", "eval", js_expr],
        capture_output=True, text=True, shell=False
    )
    return p.stdout, p.stderr, p.returncode

if __name__ == "__main__":
    cmd = "() => { const h1 = document.querySelector('h1'); const url = location.href; const allLinks = Array.from(document.querySelectorAll('a[href*=\"/docs/\"][href$=\"/introduction\"]')); const byHref = new Map(); for (const a of allLinks) { const h = a.getAttribute('href'); if (!byHref.has(h)) byHref.set(h, a.textContent.replace(/\\s+/g, ' ').trim().slice(0, 80)); } return { h1: h1 && h1.textContent.trim(), url, productHrefs: Array.from(byHref.entries()).map(([href, text]) => ({ href, text })) }; }"
    out, err, rc = cdp_eval(cmd)
    print("STDOUT:", out)
    print("STDERR:", err)
    print("RC:", rc)
