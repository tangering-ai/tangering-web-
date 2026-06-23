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
          <h2>An operation <em>that scales</em> itself.</h2>
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
      // 1, ringing
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

      // 2, active call
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

      // 3, confirmed
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
  const [ref, inView] = useInView({ threshold: 0.2, once: false });

  const channels = [
    {
      title: "Voice",
      icon: "call",
      desc: "Deliver natural, human-like phone conversations at scale through your SIP.",
    },
    {
      title: "WhatsApp",
      icon: "chat",
      desc: "Reach customers on the channel they actually answer, text or voice notes.",
    },
    {
      title: "CRM",
      icon: "swap_horiz",
      desc: "Two-way sync with Salesforce, HubSpot or your in-house CRM.",
    },
    {
      title: "API",
      icon: "code",
      desc: "Build custom flows with our webhooks and REST API in any language.",
    },
  ];

  return (
    <section className="how4" data-screen-label="07 How it works" ref={ref}>
      <div className="container">
        <FadeUp className="how4-head">
          <div className="eyebrow"><span className="pulse"></span>Omni-channel</div>
          <h2>True omni-channel <em>integration.</em></h2>
          <p className="how4-sub">
            Plug Tangering into the tools you already use. One AI agent across every
            channel, without ripping out a thing.
          </p>
        </FadeUp>

        <div className="how4-stair">
          {channels.map((c, i) => (
            <FadeUp key={i} delay={150 + i * 130}>
              <div className="how4-card" style={{ "--offset": i }}>
                <div className="how4-card-top">
                  <h3>{c.title}</h3>
                  <div className="how4-icon">
                    <span className="material-icons">{c.icon}</span>
                  </div>
                </div>
                <p>{c.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Inline voice player ─────────────────────────────
const VOICE_SAMPLE_URL = "https://media.vocaroo.com/mp3/1kEa2KjGICxl";
function VoicePlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => { setCur(a.currentTime); setDur(a.duration || 0); };
    const onEnd  = () => { setPlaying(false); setCur(0); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); }
    else { a.pause(); setPlaying(false); }
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`;
  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div className="vplayer">
      <button className={`vplayer-btn ${playing ? "is-playing" : ""}`} onClick={toggle} aria-label="Play sample">
        <span className="material-icons">{playing ? "pause" : "play_arrow"}</span>
      </button>
      <div className="vplayer-body">
        <div className="vplayer-top">
          <div className="vplayer-meta">
            <span className="vplayer-pill">SAMPLE</span>
            <span className="vplayer-name">Sarah · AI Agent</span>
            <span className="vplayer-tag">ES</span>
          </div>
          <div className="vplayer-time">
            {fmt(cur)} <span style={{opacity:0.4}}>/ {fmt(dur || 0)}</span>
          </div>
        </div>
        <div className="vplayer-wave">
          {Array.from({length: 38}).map((_, i) => (
            <span key={i} className={playing ? "is-on" : ""}
              style={{ animationDelay: `${i * 0.04}s`, animationDuration: `${0.55 + (i%5)*0.12}s` }}/>
          ))}
          <div className="vplayer-progress" style={{ width: `${pct}%` }}/>
        </div>
      </div>
      <audio ref={audioRef} src={VOICE_SAMPLE_URL} preload="auto" playsInline/>
    </div>
  );
}

// ── Voice Tech / Highlights section ─────────────────────────────
function VoiceTech() {
  const [ref, inView] = useInView({ threshold: 0.2, once: false });

  const features = [
    {
      title: "Sounds local, not robotic.",
      desc: "Native Latam Spanish and US English with regional accents. Customers don't hang up on day one.",
      visual: "globe",
    },
    {
      title: "Reads the room.",
      desc: "Detects frustration, hesitation or urgency in real time and shifts tone, calm when needed, firm when it matters.",
      visual: "duo",
    },
    {
      title: "Trained on last-mile.",
      desc: "Speaks the vocabulary of your operation: addresses, delivery windows, exceptions, payment promises, without scripting every edge case.",
      visual: "dot",
    },
    {
      title: "Remembers every attempt.",
      desc: "Picks up where the last call ended. If it's the third try today, your customer hears it, not a fresh start every time.",
      visual: "wave",
    },
  ];

  return (
    <section className="vtech" data-screen-label="08 Voice tech" ref={ref}>
      <div className="container">
        {/* Top: 2-column hero */}
        <div className="vtech-hero">
          <div className="vtech-hero-content">
            <FadeUp>
              <div className="eyebrow"><span className="pulse"></span>The voice behind Tangering</div>
            </FadeUp>
            <FadeUp delay={120}>
              <h2 className="vtech-h2">
                Natural voice.
                <br/><em className="vtech-accent">In your customer's language.</em>
              </h2>
            </FadeUp>
            <FadeUp delay={240}>
              <p className="vtech-sub">
                A voice agent built specifically for last-mile, not a generic chatbot reading a script. It speaks your customer's language, understands logistics, and knows what to do when things go off-plan.
              </p>
            </FadeUp>
            <FadeUp delay={360}>
              <div className="vtech-player-label">Hear one of our voices</div>
              <VoicePlayer/>
            </FadeUp>
          </div>

          <FadeUp delay={160} className="vtech-hero-photo-col">
            <div className="vtech-photo">
              <img
                src="assets/voice-portrait.png"
                alt="Person on a Tangering AI call"
              />
            </div>
          </FadeUp>
        </div>

        {/* Feature rows */}
        <div className="vtech-rows">
          {features.map((f, i) => (
            <FadeUp key={i} delay={120 + i * 100}>
              <div className="vtech-row">
                <div className="vtech-row-title">{f.title}</div>
                <div className="vtech-row-desc">{f.desc}</div>
                <div className="vtech-row-visual">
                  {f.visual === "wave" && (
                    <div className="vtech-vis-wave">
                      {Array.from({length: 14}).map((_, j) => (
                        <span key={j} style={{ animationDelay: `${j*0.07}s` }}/>
                      ))}
                    </div>
                  )}
                  {f.visual === "dot" && (
                    <div className="vtech-vis-dot"><span/></div>
                  )}
                  {f.visual === "duo" && (
                    <div className="vtech-vis-duo">
                      <span className="d1"/>
                      <span className="d2"/>
                    </div>
                  )}
                  {f.visual === "globe" && (
                    <div className="vtech-vis-globe">
                      <span className="material-icons">language</span>
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowBuilder({ t }) {
  const [ref, inView] = useInView({ threshold: 0.2, once: false });

  const features = [
    {
      title: "Drag-and-drop builder",
      desc: "Compose conversational flows with a no-code editor. Triggers, branches and hand-offs in minutes, anyone on your ops team can ship a new flow in an afternoon.",
      video: "assets/flow-builder.mov",
      gradient: "ag",
    },
    {
      title: "Real-time decisions on every call",
      desc: "Set conditions on real customer responses, confirm, reschedule, escalate, book, and watch the agent act on them live without a single line of code.",
      video: "assets/flow-builder-2.mov",
      gradient: "ag2",
    },
    {
      title: "Version control & live testing",
      desc: "Test every change against past calls before going live. Roll back any version in one click. Your ops team is never one bad deploy away from a broken call.",
      video: "assets/flow-builder.mov",
      gradient: "ag3",
    },
  ];

  return (
    <section className="flow3" data-screen-label="08 Flow builder" ref={ref}>
      <div className="container">
        {/* Header: 2-col title + description */}
        <div className="flow3-head">
          <FadeUp className="flow3-head-left">
            <div className="eyebrow"><span className="pulse"></span>No-code builder</div>
            <h2 className="flow3-h2">
              Build flows
              <br/><em className="flow3-accent">without writing a line.</em>
            </h2>
          </FadeUp>
          <FadeUp delay={140} className="flow3-head-right">
            <p>
              Handle everything from a simple delivery confirmation to a complex
              multi-step reschedule. Tangering's no-code studio lets your team
              design, test and launch new agents in weeks, not months.
            </p>
          </FadeUp>
        </div>

        {/* Horizontal carousel of feature cards */}
        <Flow3Carousel features={features} />
      </div>
    </section>
  );
}

function Flow3Carousel({ features }) {
  const trackRef = useRef(null);
  const scrollByCards = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector(".flow3-feature");
    const step = card ? card.getBoundingClientRect().width + 28 : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * step, behavior: "auto" });
  };
  // Translate vertical wheel into horizontal scroll on desktop
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const maxScroll = t.scrollWidth - t.clientWidth;
      if ((e.deltaY < 0 && t.scrollLeft <= 0) || (e.deltaY > 0 && t.scrollLeft >= maxScroll)) return;
      e.preventDefault();
      t.scrollBy({ left: e.deltaY, behavior: "auto" });
    };
    t.addEventListener("wheel", onWheel, { passive: false });
    return () => t.removeEventListener("wheel", onWheel);
  }, []);
  return (
    <div className="flow3-carousel-wrap">
      <div className="flow3-carousel" ref={trackRef}>
        {features.map((f, i) => (
          <div key={i} className="flow3-feature">
            <div className={`flow3-video-card flow3-grad-${f.gradient}`}>
              <video className="flow3-video" src={f.video} autoPlay loop muted playsInline />
            </div>
            <h3 className="flow3-feature-title">{f.title}</h3>
            <p className="flow3-feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="flow3-carousel-hint">
        <button type="button" className="carousel-arrow" aria-label="Previous" onClick={() => scrollByCards(-1)}>
          <span className="material-icons">arrow_back</span>
        </button>
        <span>Scroll to see more</span>
        <button type="button" className="carousel-arrow" aria-label="Next" onClick={() => scrollByCards(1)}>
          <span className="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

function Security({ t }) {
  const items = [
    {
      title: "Data privacy by default",
      desc: "Every call, transcript and event is encrypted in transit and at rest. We sign DPAs out of the box and align with GDPR and Latin-American data protection regulations.",
      icon: "verified_user",
      gradient: "sec-g1",
    },
    {
      title: "Single sign-on",
      desc: "Plug Tangering into your identity provider, Okta, Azure AD, Google Workspace, and let your security team manage access from one place.",
      icon: "vpn_key",
      gradient: "sec-g2",
    },
    {
      title: "Automatic PII redaction",
      desc: "Card numbers, IDs and addresses get masked in real time across audio, transcripts and webhooks. Configure what to redact per use case.",
      icon: "lock",
      bubbles: true,
      gradient: "sec-g3",
    },
    {
      title: "Role-based access",
      desc: "Granular roles down to the module, operations, QA, finance, admin. Audit who saw, changed or exported what, anytime.",
      icon: "settings_accessibility",
      gradient: "sec-g4",
    },
    {
      title: "Built for scale",
      desc: "Battle-tested infrastructure that has already processed +1M last-mile calls. Burst to thousands of concurrent conversations without a degraded experience.",
      icon: "rocket_launch",
      gradient: "sec-g5",
    },
    {
      title: "Private deployment",
      desc: "Need everything inside your own VPC? We offer dedicated and on-prem deployments for regulated industries and large enterprise accounts.",
      icon: "cloud_done",
      gradient: "sec-g6",
    },
  ];

  return (
    <section className="security" data-screen-label="11 Security">
      <div className="container">
        <div className="security-head">
          <FadeUp className="security-head-left">
            <span className="eyebrow"><span className="dot" /> Trust & security</span>
            <h2 className="security-h2">
              Enterprise-grade <span className="security-accent">by design.</span>
            </h2>
          </FadeUp>
          <FadeUp className="security-head-right" delay={120}>
            <p>
              From data privacy to global resilience, Tangering meets the security standards
              required to run mission-critical voice and messaging at production scale.
            </p>
          </FadeUp>
        </div>

        <SecurityCarousel items={items} />
      </div>
    </section>
  );
}

function SecurityCarousel({ items }) {
  const trackRef = useRef(null);
  const [page, setPage] = useState(1);
  const pages = items.length;

  const scrollByCards = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector(".security-tile");
    const step = card ? card.getBoundingClientRect().width + 18 : t.clientWidth * 0.4;
    t.scrollBy({ left: dir * step, behavior: "auto" });
  };

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const onScroll = () => {
      const card = t.querySelector(".security-tile");
      if (!card) return;
      const w = card.getBoundingClientRect().width + 18;
      const i = Math.round(t.scrollLeft / w) + 1;
      setPage(Math.min(Math.max(i, 1), pages));
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const maxScroll = t.scrollWidth - t.clientWidth;
      if ((e.deltaY < 0 && t.scrollLeft <= 0) || (e.deltaY > 0 && t.scrollLeft >= maxScroll)) return;
      e.preventDefault();
      t.scrollBy({ left: e.deltaY, behavior: "auto" });
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    t.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      t.removeEventListener("scroll", onScroll);
      t.removeEventListener("wheel", onWheel);
    };
  }, [pages]);

  return (
    <div className="security-carousel-v2">
      <div className="security-track" ref={trackRef}>
        {items.map((it, i) => (
          <div key={i} className="security-tile">
            <div className="security-tile-top">
              <div className="security-tile-icon">
                <span className="material-icons">{it.icon}</span>
              </div>
              <span className="security-tile-num">{String(i + 1).padStart(2, "0")} / {String(pages).padStart(2, "0")}</span>
            </div>
            <div className="security-tile-spacer" />
            <h3 className="security-tile-title">{it.title}</h3>
            <p className="security-tile-desc">{it.desc}</p>
            {it.badge && (
              <div className="security-tile-tag">
                <span className="material-icons">verified</span>
                {it.badge}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flow3-carousel-hint">
        <button type="button" className="carousel-arrow" aria-label="Previous" onClick={() => scrollByCards(-1)}>
          <span className="material-icons">arrow_back</span>
        </button>
        <span>Scroll to see more</span>
        <button type="button" className="carousel-arrow" aria-label="Next" onClick={() => scrollByCards(1)}>
          <span className="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Differentiator, HowItWorks, FlowBuilder, VoiceTech, Security });
