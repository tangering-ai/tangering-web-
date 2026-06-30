// Minimal ES/EN toggle for static sub-pages that don't run React.
// - Reads current lang from URL ?lang= or localStorage.tang_lang (default "en")
// - Marks the matching .lang-toggle button as .active
// - On click: persists to localStorage and reloads with ?lang= so other
//   pages and the React app pick up the choice
(function () {
  'use strict';

  function getLang() {
    const url = new URLSearchParams(location.search).get('lang');
    if (url === 'es' || url === 'en') return url;
    try { localStorage.removeItem('tang_lang'); } catch {}
    return 'en';
  }

  function setLang(lang) {
    // URL is the single source of truth — don't persist across sessions.
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    location.href = u.toString();
  }

  function paintActive(current) {
    document.querySelectorAll('.lang-toggle [data-set-lang]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.setLang === current);
    });
  }

  function init() {
    paintActive(getLang());
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-toggle [data-set-lang]');
      if (!btn) return;
      const next = btn.dataset.setLang;
      if (next !== getLang()) setLang(next);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
