#!/usr/bin/env python3
import subprocess
JS = r"""() => {
  const text = document.body.textContent;
  const re = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/g;
  const dates = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    if (!dates.includes(m[0])) dates.push(m[0]);
  }
  return dates.slice(0, 10);
}"""
p = subprocess.run(
    "npx --yes @playwright/cli@0.1.22 eval " + JS,
    capture_output=True, text=True, shell=True
)
print(p.stdout)
