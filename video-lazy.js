// Lazy autoplay for every <video> on the page.
//
// Root cause: the site ships ~240 MB of promo videos across the home,
// product, and about pages. With every <video autoplay> tag loading in
// parallel at page-open, browsers were saturating their per-domain
// request queue — some videos would fail, others would render as broken
// frames, and the surrounding layout would flicker while things caught up.
//
// This script keeps the same `autoplay` semantics but defers each video's
// load + play() until the element is near the viewport. Videos above the
// fold (hero backgrounds) opt out with `data-eager` so nothing regresses
// on the first paint.
(function () {
  'use strict';

  if (typeof IntersectionObserver === 'undefined') return; // very old browser: no-op

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) {
        // Kick playback (browsers autoplay muted videos, so this always resolves)
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    }
  }, { rootMargin: '200px 0px', threshold: 0.05 });

  function wire(v) {
    if (v.dataset.lazyWired === '1') return;
    if (v.hasAttribute('data-eager')) return;
    v.dataset.lazyWired = '1';
    // Tell the browser not to prefetch — we'll trigger it on play()
    v.setAttribute('preload', 'none');
    try { v.pause(); } catch {}
    io.observe(v);
  }

  function scan(root) {
    (root || document).querySelectorAll('video[autoplay]').forEach(wire);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scan());
  } else {
    scan();
  }

  // Catch React-rendered videos + anything added after first paint
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if (n.tagName === 'VIDEO') wire(n);
        else scan(n);
      });
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
