() => {
  // Count post cards in the blog
  // Featured + "Recently written" sections
  const all = document.querySelectorAll('a[href^="/blog/"]');
  const uniqueHrefs = new Set();
  for (const a of all) uniqueHrefs.add(a.getAttribute('href'));
  // Also look for category tag text in each link
  const detail = Array.from(all).map(a => {
    const text = a.textContent;
    let cat = 'unknown';
    if (/PRODUCT/.test(text)) cat = 'product';
    else if (/ENGINEERING/.test(text)) cat = 'engineering';
    else if (/GUIDES/.test(text)) cat = 'guides';
    return { href: a.getAttribute('href'), cat };
  });
  // Group by category
  const byCat = {};
  for (const d of detail) {
    byCat[d.cat] = (byCat[d.cat] || 0) + 1;
  }
  return {
    totalAnchors: all.length,
    uniquePosts: uniqueHrefs.size,
    byCategory: byCat
  };
}
