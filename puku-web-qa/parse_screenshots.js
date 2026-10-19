const r = require('./test-results/results.json');
console.log('=== TIMING PER TEST ===');
function walk(s) {
  for (const ss of (s.suites || [])) walk(ss);
  for (const spec of (s.specs || [])) {
    for (const tc of (spec.tests || [])) {
      const res = tc.results?.[0];
      if (!res) continue;
      const status = res.status;
      const dur = ((res.duration || 0) / 1000).toFixed(2);
      const file = (spec.file || '').split(/[/\\]/).pop().padEnd(28);
      console.log(`${file} ${dur}s [${status}] ${spec.title}`);
    }
  }
}
for (const s of (r.suites || [])) walk(s);
console.log('');
console.log('=== ARTIFACTS ===');
const fs = require('fs');
const dir = './test-results';
for (const f of fs.readdirSync(dir)) {
  const stat = fs.statSync(`${dir}/${f}`);
  if (stat.isFile()) {
    console.log(`${f.padEnd(40)} ${(stat.size/1024).toFixed(1)} KB`);
  }
}