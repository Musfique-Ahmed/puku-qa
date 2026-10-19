() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => /Continue/i.test(b.textContent));
  btn.click();
  return 'clicked';
}
