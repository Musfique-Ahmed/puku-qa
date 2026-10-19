() => {
  const links = Array.from(document.querySelectorAll('aside a, [role=complementary] a, nav a'));
  return links
    .filter(a => a.getAttribute('href') && a.getAttribute('href').includes('/docs/puku-editor/'))
    .slice(0, 6)
    .map(a => ({
      text: a.textContent.trim().slice(0, 40),
      href: a.getAttribute('href'),
      ariaCurrent: a.getAttribute('aria-current'),
      classes: a.className,
      dataActive: a.getAttribute('data-active') || a.getAttribute('data-state')
    }));
}
