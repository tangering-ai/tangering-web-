// Strip every dash character (em-dash "—", en-dash "–", hyphen-minus "-",
// minus sign "−") from inside <p> text nodes. Runs once on DOMContentLoaded
// and then watches for React re-renders via MutationObserver so newly added
// paragraphs get cleaned too.
//
// Scoped strictly to <p> elements — won't touch headings, links, code,
// class names, attributes or anything React/Babel might mishandle.
(function () {
  'use strict';

  const DASH_RE = /[—–\-−]+/g;

  function stripText(text) {
    return text.replace(DASH_RE, '').replace(/\s{2,}/g, ' ');
  }

  function clean(p) {
    // Walk only direct text descendants of the <p>, leaving inline elements alone
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const parent = n.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE') return NodeFilter.FILTER_REJECT;
        return DASH_RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const toReset = [];
    while (walker.nextNode()) toReset.push(walker.currentNode);
    toReset.forEach((n) => { n.nodeValue = stripText(n.nodeValue); });
  }

  function sweep(root) {
    (root || document).querySelectorAll('p').forEach(clean);
  }

  function init() {
    sweep();
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== Node.ELEMENT_NODE) return;
          if (n.tagName === 'P') clean(n);
          else sweep(n);
        });
        if (m.type === 'characterData' && m.target.parentElement?.closest('p')) {
          clean(m.target.parentElement.closest('p'));
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
