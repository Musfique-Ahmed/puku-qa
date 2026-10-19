() => {
  // Intercept mailto: navigations by overriding window.location assignment
  // First, capture current URL
  const before = window.location.href;
  // Wrap window.location to capture future assignments
  const origDescriptor = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
  // Try a different approach: listen for navigations
  let captured = null;
  const observer = new MutationObserver(() => {});
  // Instead, set up a global trap using Object.defineProperty
  try {
    let realHref = window.location.href;
    Object.defineProperty(window, '__lastNav', {
      get: () => realHref,
      set: v => { captured = v; }
    });
  } catch (e) {}
  // Also intercept anchor clicks for mailto:
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (a) captured = a.getAttribute('href');
  }, true);
  // Override window.open too
  const origOpen = window.open;
  window.open = function(url) { captured = url; return null; };
  return { before, interceptorInstalled: true };
}
