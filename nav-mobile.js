// Mobile nav burger — works for both the React-rendered home nav and the
// static sub-pages. Injects a burger button into every .nav element and
// toggles a .nav-open class on the document body when tapped. Closes when
// the user taps a nav link, the backdrop, or presses Escape.
(function () {
  'use strict';

  const BURGER_SVG =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
    '<line class="ln1" x1="4" y1="7" x2="20" y2="7"/>' +
    '<line class="ln2" x1="4" y1="12" x2="20" y2="12"/>' +
    '<line class="ln3" x1="4" y1="17" x2="20" y2="17"/>' +
    '</svg>';

  function close() {
    document.body.classList.remove('nav-open');
  }

  function setupNav(nav) {
    if (!nav || nav.dataset.mobileWired === '1') return;
    nav.dataset.mobileWired = '1';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-burger';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = BURGER_SVG;
    nav.appendChild(btn);

    btn.addEventListener('click', () => {
      const open = !document.body.classList.contains('nav-open');
      document.body.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close when a link inside the nav is clicked
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) close();
    });
  }

  // Close on Escape + clicks outside the nav
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('nav-open')) return;
    if (e.target.closest('.nav')) return;
    close();
  });

  function bootstrap() {
    document.querySelectorAll('.nav').forEach(setupNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // React-rendered home: nav appears after a tick. Re-scan if needed.
  const mo = new MutationObserver(() => {
    document.querySelectorAll('.nav:not([data-mobile-wired])').forEach(setupNav);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
