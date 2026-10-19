#!/usr/bin/env python3
"""Run a JS eval via playwright-cli and print the result."""
import subprocess, sys

JS = r'''() => {
  const all = document.querySelectorAll("a[href^=\"/blog/\"]");
  const uniqueHrefs = new Set();
  for (const a of all) uniqueHrefs.add(a.getAttribute("href"));
  const detail = Array.from(all).map(a => {
    const text = a.textContent;
    let cat = "unknown";
    if (/PRODUCT/.test(text)) cat = "product";
    else if (/ENGINEERING/.test(text)) cat = "engineering";
    else if (/GUIDES/.test(text)) cat = "guides";
    return { href: a.getAttribute("href"), cat };
  });
  const byCat = {};
  for (const d of detail) {
    byCat[d.cat] = (byCat[d.cat] || 0) + 1;
  }
  return { totalAnchors: all.length, uniquePosts: uniqueHrefs.size, byCategory: byCat };
}'''

p = subprocess.run(
    "npx --yes @playwright/cli@0.1.22 eval " + JS,
    capture_output=True, text=True, shell=True
)
with open("runs/TC-011/result.txt", "w") as f:
    f.write("STDOUT:\n" + p.stdout + "\nSTDERR:\n" + p.stderr)
print("written to runs/TC-011/result.txt, len stdout=", len(p.stdout), "stderr=", len(p.stderr))
