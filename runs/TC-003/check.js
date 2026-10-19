() => {
  const h1 = document.querySelector('h1').innerText.trim();
  const links = Array.from(document.querySelectorAll('a'))
    .filter(a => /Continue with/.test(a.textContent))
    .map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
  const legal = Array.from(document.querySelectorAll('a'))
    .filter(a => /Terms|Privacy/.test(a.textContent))
    .map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
  return JSON.stringify({ h1, links, legal }, null, 2);
}
