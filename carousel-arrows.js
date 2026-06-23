// Vanilla carousel arrow + wheel handler for any static horizontal-scroll
// carousel that doesn't run inside React. Hooks up every .flow3-carousel-hint
// that declares a target via data-carousel-hint-for="<selector>" — the arrow
// buttons inside it scroll that target by one card-width left or right, and a
// wheel listener on the target turns vertical wheel events into horizontal
// scroll so desktop mice can advance the carousel too.
(function () {
  'use strict';

  function cardStep(track) {
    const card = track.querySelector('[class*="tile"], [class*="feature"], [class*="card"]');
    if (card) return card.getBoundingClientRect().width + 18;
    return track.clientWidth * 0.5;
  }

  function attach(hint) {
    const targetSel = hint.getAttribute('data-carousel-hint-for');
    if (!targetSel) return;
    const track = document.querySelector(targetSel);
    if (!track) return;

    hint.querySelectorAll('[data-carousel-dir]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dir = Number(btn.getAttribute('data-carousel-dir')) || 1;
        // scroll-snap: 'smooth' gets intercepted, so step instantly and let
        // mandatory snap-align finish the visual transition.
        track.scrollBy({ left: dir * cardStep(track), behavior: 'auto' });
      });
    });

    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = track.scrollWidth - track.clientWidth;
      if ((e.deltaY < 0 && track.scrollLeft <= 0) || (e.deltaY > 0 && track.scrollLeft >= max)) return;
      e.preventDefault();
      track.scrollBy({ left: e.deltaY, behavior: 'auto' });
    }, { passive: false });
  }

  function init() {
    document.querySelectorAll('[data-carousel-hint-for]').forEach(attach);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
