// "Talk to our AI agent" widget — floating button + modal that asks for
// the visitor's phone number and triggers an outbound call from a Tangering
// agent via the /api/call serverless proxy.
//
// Self-contained vanilla JS. Injects its own DOM and styles via styles.css.
(function () {
  'use strict';

  const COOLDOWN_KEY = 'tg-call-cooldown-until';
  const COOLDOWN_MS = 60_000;

  function nowCooldownRemaining() {
    const until = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    return Math.max(0, until - Date.now());
  }

  function setCooldown() {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
  }

  // Loose E.164 sanity check — must start with + and 7-15 digits after.
  function normalizePhone(raw) {
    const trimmed = String(raw || '').replace(/[\s().-]/g, '');
    if (!/^\+[1-9]\d{6,14}$/.test(trimmed)) return null;
    return trimmed;
  }

  const lang = (() => {
    const url = new URLSearchParams(location.search).get('lang');
    return (url === 'es' || url === 'en') ? url : 'en';
  })();
  const es = lang === 'es';
  const L = es
    ? { label: 'Hablar con nuestra IA', aria: 'Hablar con nuestro agente de IA' }
    : { label: 'Talk to our AI',         aria: 'Talk to our AI agent' };

  function buildDom() {
    const fab = document.createElement('button');
    fab.className = 'tg-call-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', L.aria);
    fab.innerHTML = `
      <span class="tg-call-fab-pulse"></span>
      <span class="material-icons">phone_in_talk</span>
      <span class="tg-call-fab-label">${L.label}</span>
    `;

    const backdrop = document.createElement('div');
    backdrop.className = 'tg-call-backdrop';
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <div class="tg-call-modal" role="dialog" aria-modal="true" aria-labelledby="tg-call-title">
        <button type="button" class="tg-call-close" aria-label="Close">
          <span class="material-icons">close</span>
        </button>
        <div class="tg-call-pill">
          <span class="tg-call-pill-dot"></span>
          Live demo
        </div>
        <h3 id="tg-call-title">Get a call from our AI right now.</h3>
        <p class="tg-call-sub">Drop your phone number and our agent calls you in seconds. Hang up whenever.</p>
        <form class="tg-call-form">
          <label class="tg-call-field">
            <span>Your name <em>(optional)</em></span>
            <input type="text" name="name" autocomplete="given-name" maxlength="60" placeholder="Cindy" />
          </label>
          <label class="tg-call-field">
            <span>Phone number <em>with country code</em></span>
            <input type="tel" name="phone" required autocomplete="tel" placeholder="+57 300 123 4567" />
          </label>
          <button type="submit" class="tg-call-submit">
            Call me now
            <span class="material-icons">arrow_forward</span>
          </button>
          <p class="tg-call-msg" hidden></p>
        </form>
        <p class="tg-call-foot">By tapping "Call me now" you agree to receive a one-time AI demo call.</p>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(backdrop);
    return { fab, backdrop };
  }

  function init() {
    if (document.querySelector('.tg-call-fab')) return; // already mounted
    const { fab, backdrop } = buildDom();
    const modal = backdrop.querySelector('.tg-call-modal');
    const closeBtn = backdrop.querySelector('.tg-call-close');
    const form = backdrop.querySelector('.tg-call-form');
    const msg = backdrop.querySelector('.tg-call-msg');
    const submit = backdrop.querySelector('.tg-call-submit');
    const phoneInput = backdrop.querySelector('input[name="phone"]');
    const nameInput = backdrop.querySelector('input[name="name"]');

    const open = () => {
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add('is-open'));
      setTimeout(() => phoneInput.focus(), 60);
    };
    const close = () => {
      backdrop.classList.remove('is-open');
      setTimeout(() => { backdrop.hidden = true; }, 200);
    };

    fab.addEventListener('click', open);
    window.addEventListener('tangering:open-call-agent', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

    function setMessage(text, kind) {
      msg.textContent = text;
      msg.dataset.kind = kind || '';
      msg.hidden = !text;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setMessage('');

      const remaining = nowCooldownRemaining();
      if (remaining > 0) {
        setMessage(`Wait ${Math.ceil(remaining / 1000)}s before requesting another call.`, 'error');
        return;
      }

      const phone = normalizePhone(phoneInput.value);
      if (!phone) {
        setMessage('Please enter a valid number including the country code (e.g. +57 300 123 4567).', 'error');
        phoneInput.focus();
        return;
      }
      const name = nameInput.value.trim();

      submit.disabled = true;
      submit.classList.add('is-loading');
      setMessage('Connecting…', 'info');

      try {
        const res = await fetch('/api/call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, name }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.ok) {
          setCooldown();
          setMessage('Got it — your phone should ring in a few seconds. 🎉', 'success');
          form.reset();
        } else if (res.status === 429) {
          setMessage(`Too soon — try again in ${data.retry_after || 60}s.`, 'error');
        } else if (res.status === 400) {
          setMessage('That phone number doesn\'t look right. Include the country code.', 'error');
        } else if (res.status === 500 && data.error === 'agent_not_configured') {
          setMessage('Demo isn\'t configured on the server yet. Drop us a note instead.', 'error');
        } else {
          setMessage('Something went wrong reaching the agent. Try again in a minute.', 'error');
        }
      } catch {
        setMessage('Network hiccup. Check your connection and try again.', 'error');
      } finally {
        submit.disabled = false;
        submit.classList.remove('is-loading');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
