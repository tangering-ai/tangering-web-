// Differentiator, HowItWorks, FlowBuilder

function Differentiator({ t }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  return (
    <section className="diff" id="diff" data-screen-label="06 Differentiator" ref={ref}>
      <div className="container">
        <FadeUp className="diff-intro">
          <div className="eyebrow">
            <span className="pulse"></span>
            {t.diff.eyebrow}
          </div>
          <h2>{t.diff.h2}</h2>
          <p className="lead">{t.diff.sub}</p>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="diff-grid">
            <div className="diff-col old">
              <span className="badge">{t.diff.oldBadge}</span>
              <h3>{t.diff.oldTitle}</h3>
              <div className="diff-list">
                {[t.diff.o1, t.diff.o2, t.diff.o3, t.diff.o4, t.diff.o5].map((it, i) => (
                  <div
                    key={i}
                    className={`diff-item struck ${inView ? "in" : ""}`}
                    style={{ transitionDelay: `${0.5 + i * 0.25}s` }}
                  >
                    <span className="diff-icon">×</span>
                    <span className="val">{it}</span>
                  </div>
                ))}
              </div>
              <div className="diff-price">
                <div className="v">{t.diff.oPrice}</div>
                <div className="l">{t.diff.oPriceL}</div>
              </div>
            </div>

            <div className="diff-col new">
              <span className="badge">{t.diff.newBadge}</span>
              <h3>{t.diff.newTitle}</h3>
              <div className="diff-list">
                {[t.diff.n1, t.diff.n2, t.diff.n3, t.diff.n4, t.diff.n5].map((it, i) => (
                  <div key={i} className="diff-item">
                    <span className="diff-icon">✓</span>
                    <span className="val">{it}</span>
                  </div>
                ))}
              </div>
              <div className="diff-price">
                <div className="v">{t.diff.nPrice}</div>
                <div className="l">{t.diff.nPriceL}</div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── iPhone 17 Call Screen ───────────────────────────────────
function IPhone17Call({ play }) {
  const [phase, setPhase]         = useState("idle");   // idle | ringing | active | confirmed
  const [seconds, setSeconds]     = useState(0);
  const [lines, setLines]         = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const timerRef  = useRef(null);
  const phoneRef  = useRef(null);

  const transcriptRef = useRef(null);

  const TRANSCRIPT = [
    { delay: 500,  text: "Hola James 👋 soy Sarah, de Envíos.com" },
    { delay: 2800, text: "Tu pedido #4521 está agendado para hoy 3–5pm." },
    { delay: 5200, text: "¿Puedes confirmar: 742 Elm Street?" },
    { delay: 7800, text: "Perfecto, llegará en 15 min. ¡Hasta pronto! 📦" },
  ];

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [lines, confirmed]);

  // Reset when out of view
  useEffect(() => {
    if (!play) {
      setPhase("idle");
      setSeconds(0);
      setLines([]);
      setConfirmed(false);
      clearInterval(timerRef.current);
    }
  }, [play]);

  // Sequence when play=true
  useEffect(() => {
    if (!play) return;
    let alive = true;

    const run = async () => {
      // 1 — ringing
      setPhase("ringing");
      if (typeof gsap !== "undefined") {
        gsap.fromTo(phoneRef.current,
          { rotate: -2 },
          { rotate: 2, duration: 0.08, ease: "none", repeat: 8, yoyo: true,
            onComplete: () => gsap.set(phoneRef.current, { rotate: 0 }) }
        );
      }
      await new Promise(r => setTimeout(r, 1800));
      if (!alive) return;

      // 2 — active call
      setPhase("active");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);

      // Transcript lines
      TRANSCRIPT.forEach(({ delay, text }) => {
        setTimeout(() => {
          if (!alive) return;
          setLines(prev => [...prev, text]);
        }, delay);
      });

      // 3 — confirmed
      await new Promise(r => setTimeout(r, 10500));
      if (!alive) return;
      clearInterval(timerRef.current);
      setConfirmed(true);
      setPhase("confirmed");
    };

    run();
    return () => {
      alive = false;
      clearInterval(timerRef.current);
    };
  }, [play]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  return (
    <div className="ip17-wrap" ref={phoneRef}>
      {/* ─ Phone chassis ─ */}
      <div className="ip17">
        {/* Side buttons */}
        <div className="ip17-action"></div>
        <div className="ip17-vol-up"></div>
        <div className="ip17-vol-dn"></div>
        <div className="ip17-power"></div>

        {/* Screen */}
        <div className="ip17-screen">
          <div className="ip17-island"></div>

          {/* IDLE */}
          {phase === "idle" && (
            <div className="ip17-idle">
              <div className="ip17-time">9:41</div>
              <div className="ip17-date">martes, 3 de junio</div>
            </div>
          )}

          {/* RINGING */}
          {phase === "ringing" && (
            <div className="ip17-incoming">
              <p className="ip17-incoming-label">Llamada entrante</p>
              <div className="ip17-avatar-ring">
                <div className="ip17-avatar-ring2"></div>
                <div className="ip17-avatar">
                  <span>S</span>
                </div>
              </div>
              <h2 className="ip17-caller">Sarah</h2>
              <p className="ip17-caller-sub">AI Agente · Tangering</p>
              <div className="ip17-call-btns">
                <button className="ip17-decline">
                  <svg viewBox="0 0 24 24" fill="white"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                </button>
                <button className="ip17-answer">
                  <svg viewBox="0 0 24 24" fill="white"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE */}
          {(phase === "active" || phase === "confirmed") && (
            <div className="ip17-active">
              <div className="ip17-active-top">
                <div className="ip17-active-avatar"><span>S</span></div>
                <h3 className="ip17-active-name">Sarah</h3>
                <p className="ip17-active-sub">AI Agente · Tangering</p>
                <p className="ip17-active-timer">{confirmed ? "Llamada terminada" : fmt(seconds)}</p>
              </div>

              {/* Waveform */}
              {!confirmed && (
                <div className="ip17-wave">
                  {Array.from({length: 28}).map((_, i) => (
                    <span key={i} className="ip17-wave-bar"
                      style={{ animationDelay: `${i * 0.06}s`,
                               animationDuration: `${0.5 + (i % 5) * 0.12}s` }} />
                  ))}
                </div>
              )}

              {/* Transcript */}
              <div className="ip17-transcript" ref={transcriptRef}>
                {lines.map((line, i) => (
                  <div key={i} className="ip17-line">{line}</div>
                ))}
                {confirmed && (
                  <div className="ip17-confirmed-badge">
                    <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#22c55e"/><path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Entrega confirmada · #4521
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="ip17-controls">
                {[
                  { ico: "🔇", label: "silenciar" },
                  { ico: "⌨️", label: "teclado" },
                  { ico: "🔊", label: "altavoz" },
                  { ico: "➕", label: "añadir" },
                ].map((c, i) => (
                  <div key={i} className="ip17-ctrl">
                    <div className="ip17-ctrl-btn">{c.ico}</div>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
              <button className="ip17-end">
                <svg viewBox="0 0 24 24" fill="white"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HowItWorks({ t }) {
  const [ref, inView] = useInView({ threshold: 0.25, once: false });
  return (
    <section className="how" data-screen-label="07 How it works" ref={ref}>
      <div className="container">
        <FadeUp className="how-head">
          <div className="eyebrow"><span className="pulse"></span>{t.how.eyebrow}</div>
          <h2>{t.how.h2}</h2>
        </FadeUp>

        <div className="how-body">
          {/* ─ iPhone 17 ─ */}
          <div className="how-phone-col">
            <IPhone17Call play={inView} />
          </div>

          {/* ─ Steps ─ */}
          <div className="how-steps-col">
            <div className="how-steps">
              <div className={`how-line-v ${inView ? "in" : ""}`}></div>
              {[
                { n: "01", title: t.how.s1, desc: t.how.s1d },
                { n: "02", title: t.how.s2, desc: t.how.s2d },
                { n: "03", title: t.how.s3, desc: t.how.s3d },
              ].map((s, i) => (
                <FadeUp key={i} delay={300 + i * 180}>
                  <div className={`how-step ${inView ? "in" : ""}`}>
                    <div className="ball">{s.n}</div>
                    <div className="how-step-text">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowBuilder({ t }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  return (
    <section className={`flow ${inView ? "in" : ""}`} data-screen-label="08 Flow builder" ref={ref}>
      <div className="container">
        <FadeUp className="flow-head">
          <div className="eyebrow" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
            <span className="pulse"></span>
            {t.flow.eyebrow}
          </div>
          <h2>{t.flow.h2}</h2>
          <p className="lead">{t.flow.sub}</p>
        </FadeUp>

        <FadeUp delay={200}>
          <div className="flow-canvas">
            <svg className="flow-svg" viewBox="0 0 1000 220" preserveAspectRatio="none">
              <path d="M 140 60 C 200 60, 220 60, 280 60" />
              <path d="M 420 60 C 480 60, 500 60, 560 60" />
              <path d="M 700 60 C 760 60, 780 60, 840 60" />
            </svg>
            <div className="flow-nodes">
              {[
                { t: t.flow.n1t, d: t.flow.n1d, ico: "⚡" },
                { t: t.flow.n2t, d: t.flow.n2d, ico: "📞" },
                { t: t.flow.n3t, d: t.flow.n3d, ico: "?" },
                { t: t.flow.n4t, d: t.flow.n4d, ico: "↗" },
              ].map((n, i) => (
                <div key={i} className="flow-node">
                  <div className="ico">{n.ico}</div>
                  <div className="type">{n.t}</div>
                  <div className="title">{n.d}</div>
                  <div className="meta">
                    <span className="d"></span> {t.flow.meta}
                  </div>
                </div>
              ))}
            </div>

            <div className="flow-toolbar">
              <div className="flow-tool">{t.flow.tools1}</div>
              <div className="flow-tool">{t.flow.tools2}</div>
              <div className="flow-tool">{t.flow.tools3}</div>
              <div className="flow-tool">{t.flow.tools4}</div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

Object.assign(window, { Differentiator, HowItWorks, FlowBuilder });
