() => {
  const h1 = document.querySelector('h1');
  const url = location.href;
  // All /docs/*/introduction links in main content (not sidebar/footer)
  const allLinks = Array.from(document.querySelectorAll('a[href*="/docs/"][href$="/introduction"]'));
  // De-dupe by href
  const byHref = new Map();
  for (const a of allLinks) {
    const h = a.getAttribute('href');
    if (!byHref.has(h)) byHref.set(h, a.textContent.replace(/\s+/g, ' ').trim().slice(0, 80));
  }
  return {
    h1: h1 && h1.textContent.trim(),
    url,
    productHrefs: Array.from(byHref.entries()).map(([href, text]) => ({ href, text }))
  };
}
