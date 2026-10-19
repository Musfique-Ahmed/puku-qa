const r = require('./test-results/results.json');
const stats = r.stats || {};
console.log('=== OVERALL STATS ===');
console.log('Expected:', stats.expected);
console.log('Skipped:', stats.skipped);
console.log('Unexpected:', stats.unexpected);
console.log('Flaky:', stats.flaky);
console.log('Duration:', stats.duration + 'ms');
console.log('Start:', stats.startTime);
console.log('');
console.log('=== PER-FILE BREAKDOWN ===');
const files = {};
function walk(s) {
  for (const ss of (s.suites || [])) walk(ss);
  for (const spec of (s.specs || [])) {
    const file = (spec.file || '').split(/[/\\]/).pop();
    if (!files[file]) files[file] = { pass: 0, fail: 0, skip: 0, total: 0 };
    files[file].total++;
    for (const tc of (spec.tests || [])) {
      const status = tc.results?.[0]?.status;
      if (status === 'passed') files[file].pass++;
      else if (status === 'skipped') files[file].skip++;
      else if (status === 'failed' || status === 'timedOut') files[file].fail++;
    }
  }
}
for (const s of (r.suites || [])) walk(s);
for (const [file, s] of Object.entries(files).sort()) {
  console.log(file.padEnd(28), 'pass:', s.pass, 'skip:', s.skip, 'fail:', s.fail, 'total:', s.total);
}
console.log('');
console.log('=== SKIPPED TESTS ===');
function walkSkip(s) {
  for (const ss of (s.suites || [])) walkSkip(ss);
  for (const spec of (s.specs || [])) {
    for (const tc of (spec.tests || [])) {
      const status = tc.results?.[0]?.status;
      if (status === 'skipped') console.log('  -', spec.title);
    }
  }
}
for (const s of (r.suites || [])) walkSkip(s);