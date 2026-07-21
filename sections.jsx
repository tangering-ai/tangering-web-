// Problem, Solution (sticky), SocialProof, UseCases

// Read current UI language at render time. setLangPersist writes to
// localStorage before calling setLang, so this stays in sync as long as
// React re-renders these components when the parent App's lang state changes.
function isEsLang() {
  try {
    const url = new URLSearchParams(location.search).get('lang');
    return url === 'es';
  } catch { return false; }
}

// Local phone (used by Solution section)
function Phone({ children, className = "" }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <div className="phone-notch"></div>
        {children}
      </div>
    </div>
  );
}
function PhoneBar({ dark = false }) {
  return (
    <div className="phone-bar" style={{ color: dark ? "white" : "var(--dark)" }}>
      <span>9:41</span>
      <span className="phone-bar-icons">
        <span style={{ fontSize: 9 }}>●●●●●</span>
        <span style={{ marginLeft: 4 }}>100</span>
      </span>
    </div>
  );
}

// iPhone 14 Pro frame for the call screen
function IPhonePro({ children }) {
  return (
    <div className="ipp-body">
      {/* side buttons */}
      <div className="ipp-vol-up"></div>
      <div className="ipp-vol-dn"></div>
      <div className="ipp-action"></div>
      <div className="ipp-power"></div>
      <div className="ipp-screen">
        {/* Dynamic Island */}
        <div className="ipp-island"></div>
        {children}
      </div>
    </div>
  );
}

function Problem({ t }) {
  const sectionRef = useRef(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    if (typeof gsap === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;

    const cards = section.querySelectorAll(".problem-card");
    const isMobile = window.matchMedia("(max-width: 700px)").matches;

    // Mobile: skip the entrance animation entirely — the smaller viewport
    // means the cards are visible almost immediately, and any opacity/y/scale
    // pre-state made them look "cut" before ScrollTrigger fired. Just wire the
    // broken transition on scroll.
    if (isMobile) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1, clearProps: "all" });
      ScrollTrigger.create({
        trigger: section.querySelector(".problem-grid"),
        start: "top 92%",
        onEnter: () => setTimeout(() => setBroken(true), 1200),
        onLeaveBack: () => setBroken(false),
      });
    } else {
      // Desktop keeps the bounce stagger entrance
      gsap.from(cards, {
        opacity: 0, y: 70, scale: 0.92,
        duration: 0.75, ease: "back.out(1.8)",
        stagger: 0.14,
        scrollTrigger: {
          trigger: section.querySelector(".problem-grid"),
          start: "top 82%",
          toggleActions: "play none none reverse",
          onEnter: () => setTimeout(() => setBroken(true), 2000),
          onLeaveBack: () => setBroken(false),
        },
      });
    }

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return (
    <section className="problem" data-screen-label="02 Problem" ref={sectionRef}>
      <div className="container">
        <FadeUp>
          <div className="eyebrow">
            <span className="pulse"></span>
            {t.problem.eyebrow}
          </div>
        </FadeUp>
        <h2 style={{ marginTop: 24 }}>
          <WordReveal>{t.problem.h2a}</WordReveal>
          <br />
          <WordReveal delay={300} className="accent" style={{ color: "var(--orange)" }}>
            {t.problem.h2b}
          </WordReveal>
        </h2>
        <FadeUp delay={200}>
          <p className="lead">{t.problem.sub}</p>
        </FadeUp>

        <div className="problem-grid">
          <div className={`problem-card ${broken ? "broken" : ""}`}>
            <span className="num">$<CountUp to={t.problem.c1n} /></span>
            <div className="label">{t.problem.c1}</div>
          </div>
          <div className={`problem-card ${broken ? "broken" : ""}`} style={{ animationDelay: "0.15s" }}>
            <span className="num">
              <CountUp to={t.problem.c2n} />
              <span className="unit">{t.problem.c2u}</span>
            </span>
            <div className="label">{t.problem.c2}</div>
          </div>
          <div className={`problem-card ${broken ? "broken" : ""}`} style={{ animationDelay: "0.3s" }}>
            <span className="num">
              <CountUp to={t.problem.c3n} />
              <span className="unit">{t.problem.c3u}</span>
            </span>
            <div className="label">{t.problem.c3}</div>
          </div>
        </div>

        <FadeUp delay={200}>
          <p className="lead problem-close">{t.problem.close}</p>
        </FadeUp>
        <FadeUp className="problem-resolve">
          <span className="orange">{t.problem.resolve1}</span>
          {t.problem.resolve2}
        </FadeUp>
      </div>
    </section>
  );
}

// ── Spine — identity statement (typographic, no visuals) ─────
function Spine({ t }) {
  return (
    <section className="spine" data-screen-label="03 Spine">
      <div className="container spine-inner">
        <FadeUp>
          <div className="eyebrow spine-eyebrow">
            <span className="pulse"></span>
            {t.spine.eyebrow}
          </div>
        </FadeUp>
        <FadeUp delay={120}>
          <h2 className="spine-h1">
            <WordReveal>{t.spine.h1}</WordReveal>
          </h2>
        </FadeUp>
        <FadeUp delay={260}>
          <p className="spine-h2">{t.spine.h2}</p>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Shared visual wrapper ────────────────────────────────────
function PhoneStage({ children, glow }) {
  return (
    <div className="phone-stage" data-glow={glow}>
      <div className="phone-stage-inner">{children}</div>
    </div>
  );
}

function glowForStep(active) {
  if (active === 1) return "blue";    // map verify
  if (active === 3) return "green";   // courier WA
  return "orange";                    // call, reschedule, CRM
}

function renderStage(step) {
  if (step === 1) return <MapCard />;
  if (step === 2) return <RescheduleView />;
  if (step === 3) return <CourierNotifyView />;
  if (step === 4) return <CRMUpdateView />;
  return <SolutionPhone step={step} />;
}

// Sticky storytelling: scroll position drives which phone variant shows
function Solution({ t }) {
  const containerRef = useRef(null);
  const stepRefs = useRef([]);
  const [active, setActive] = useState(0);

  // Fade transition between active steps
  const [displayed, setDisplayed] = useState(0);
  const [visible, setVisible]     = useState(true);

  useEffect(() => {
    if (active === displayed) return;
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayed(active);
      setVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [active, displayed]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");

    let obs = null;
    let interval = null;

    const setupDesktop = () => {
      obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && e.intersectionRatio > 0.5) {
              const idx = Number(e.target.dataset.idx);
              setActive(idx);
            }
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.5, 1] }
      );
      stepRefs.current.forEach((el) => el && obs.observe(el));
    };

    const setupMobile = () => {
      // Auto-cycle the active step every 2.8s. The visual + text both track
      // the same state so they advance together, without any scroll input.
      setActive(0);
      interval = setInterval(() => {
        setActive((prev) => (prev + 1) % 5);
      }, 2800);
    };

    const teardown = () => {
      if (obs) { obs.disconnect(); obs = null; }
      if (interval) { clearInterval(interval); interval = null; }
    };

    const apply = () => {
      teardown();
      if (mq.matches) setupMobile();
      else setupDesktop();
    };

    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      teardown();
    };
  }, []);

  const steps = [
    { title: t.solution.step1t, desc: t.solution.step1d },
    { title: t.solution.step2t, desc: t.solution.step2d },
    { title: t.solution.step3t, desc: t.solution.step3d },
    { title: t.solution.step4t, desc: t.solution.step4d },
    { title: t.solution.step5t, desc: t.solution.step5d },
  ];

  return (
    <section className="solution" id="solution" data-screen-label="03 Solution">
      <div className="container">
        <FadeUp className="solution-intro">
          <div className="eyebrow">
            <span className="pulse"></span>
            {t.solution.eyebrow}
          </div>
          <h2>One call. <em>Five steps.</em> Zero friction.</h2>
          <p className="lead">{t.solution.sub}</p>
        </FadeUp>

        <div className="sticky-wrap" ref={containerRef}>
          <div className="sticky-phone">
            <PhoneStage glow={glowForStep(displayed)}>
              <div className={`stage-fade ${visible ? "in" : "out"}`}>
                {renderStage(displayed)}
              </div>
            </PhoneStage>
          </div>

          <div className="sticky-steps">
            {steps.map((s, i) => (
              <div
                key={i}
                ref={(el) => (stepRefs.current[i] = el)}
                data-idx={i}
                className={`step ${active === i ? "active" : ""}`}
              >
                <div className="step-num">{i + 1}</div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// All transcript lines accumulated per step
function getCallTranscript(es) {
  return es ? [
    [
      { agent: true,  msg: "¡Hola James! Soy Sarah, asistente de IA de Envíos.com." },
      { agent: false, msg: "¿Aló?" },
      { agent: true,  msg: "Te llamo por tu pedido #4521 programado para entrega hoy." },
    ],
    [
      { agent: false, msg: "Ah sí, dime." },
      { agent: true,  msg: "Solo confirmo un par de datos. ¿Hablo con James Carter?" },
      { agent: false, msg: "Sí, soy yo." },
    ],
    [
      { agent: true,  msg: "¿Confirmas tu dirección de entrega? Tenemos Calle 85 #12-45." },
      { agent: false, msg: "Sí, es correcta, Calle 85 #12-45." },
      { agent: true,  msg: "Perfecto. Tu ventana de entrega queda confirmada para hoy entre 3 y 5 PM." },
    ],
    [
      { agent: false, msg: "Me viene perfecto." },
      { agent: true,  msg: "Avisé al mensajero. Te llegará un mensaje 20 min antes de la llegada." },
      { agent: false, msg: "¡Genial, muchas gracias!" },
    ],
    [
      { agent: true,  msg: "¡Todo listo, James! Que tengas un buen día. ¡Hasta luego!" },
      { agent: false, msg: "¡Gracias, chao!" },
      { agent: null,  msg: "Llamada finalizada · 0:22" },
    ],
  ] : [
    [
      { agent: true,  msg: "Hi James! I'm Sarah, an AI assistant from Envios.com." },
      { agent: false, msg: "Hello?" },
      { agent: true,  msg: "I'm calling about your order #4521 scheduled for delivery today." },
    ],
    [
      { agent: false, msg: "Oh right, yes, what do you need?" },
      { agent: true,  msg: "Just a couple of quick details. Am I speaking with James Carter?" },
      { agent: false, msg: "Yes, that's me." },
    ],
    [
      { agent: true,  msg: "Can you confirm your delivery address? We have 742 Elm Street." },
      { agent: false, msg: "Yes, that's correct, 742 Elm Street." },
      { agent: true,  msg: "Perfect. Your delivery window is confirmed for 3–5 PM today." },
    ],
    [
      { agent: false, msg: "That works perfectly for me." },
      { agent: true,  msg: "Your courier has been notified. You'll get a text 20 min before arrival." },
      { agent: false, msg: "Great, thank you so much!" },
    ],
    [
      { agent: true,  msg: "You're all set, James! Have a great day. Goodbye!" },
      { agent: false, msg: "Thanks, bye!" },
      { agent: null,  msg: "Call ended · 0:22" },
    ],
  ];
}

// Backend events accumulated per step
const CALL_EVENTS = [
  [
    { color: "#fe5e32", label: "[AI] Outbound call initiated · +1 555 012 4567" },
    { color: "#a78bfa", label: "[AI] Agent Sarah v3 activated" },
    { color: "#38bdf8", label: "[CRM] Fetching order #4521..." },
  ],
  [
    { color: "#38bdf8", label: "[CRM] Matched: James Carter · confirmed" },
    { color: "#34d399", label: "[MAP] Geocoding 742 Elm Street" },
    { color: "#a78bfa", label: "[AI] Address confirmation requested" },
  ],
  [
    { color: "#34d399", label: "[AI] Address confirmed by customer" },
    { color: "#fbbf24", label: "[CRM] Window 3–5pm → CONFIRMED" },
    { color: "#38bdf8", label: "[CRM] Delivery status → CONFIRMED" },
  ],
  [
    { color: "#f472b6", label: "[PUSH] Notification → Courier #12" },
    { color: "#22d3ee", label: "[MAP] Route updated: 742 Elm Street" },
    { color: "#34d399", label: "[PUSH] Courier acknowledged receipt" },
  ],
  [
    { color: "#38bdf8", label: "[CRM] Record synced · order #4521" },
    { color: "#f472b6", label: "[HOOK] Webhook fired → ERP" },
    { color: "#beef62", label: "[DONE] Confirmed, 0 humans involved" },
  ],
];

// ── Map step, immersive map + search + confirmation card ─────
function MapCard() {
  const divRef    = useRef(null);
  const mapRef    = useRef(null);
  const cardRef   = useRef(null);
  const [phase, setPhase] = useState(0); // 0=typing 1=looking 2=confirmed
  const [typed, setTyped] = useState("");
  const FULL_ADDRESS = "742 Sutter St, San Francisco, CA";

  // Typing animation + phase timers
  useEffect(() => {
    if (cardRef.current && typeof gsap !== "undefined") {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "all" }
      );
    }
    // Type address character by character
    let i = 0;
    setTyped("");
    const typer = setInterval(() => {
      i++;
      setTyped(FULL_ADDRESS.slice(0, i));
      if (i >= FULL_ADDRESS.length) clearInterval(typer);
    }, 55);

    const t1 = setTimeout(() => setPhase(1), FULL_ADDRESS.length * 55 + 300);
    const t2 = setTimeout(() => setPhase(2), FULL_ADDRESS.length * 55 + 1400);
    return () => { clearInterval(typer); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Leaflet, full bleed, no borders
  useEffect(() => {
    const L = window.L;
    if (!L || mapRef.current) return;
    const lat = 37.78769, lng = -122.41845;
    const map = L.map(divRef.current, {
      center: [lat, lng], zoom: 17,
      zoomControl: false, attributionControl: false,
      scrollWheelZoom: false, dragging: false, doubleClickZoom: false,
      keyboard: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }).addTo(map);
    const icon = L.divIcon({
      className: '',
      html: `<div class="map-live-pin"><div class="map-live-ring"></div><div class="map-live-dot"></div><div class="map-live-shadow"></div></div>`,
      iconSize: [40, 40], iconAnchor: [20, 20],
    });
    L.marker([lat, lng], { icon }).addTo(map);
    setTimeout(() => map.invalidateSize(), 100);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  return (
    <div className="sol-map-immersive" ref={cardRef}>
      {/* Full-bleed map, no card */}
      <div className="sol-map-immersive-body" ref={divRef}></div>

      {/* Top search bar with typing */}
      <div className="sol-search">
        <span className="material-icons sol-search-icon">search</span>
        <div className="sol-search-text">
          {typed}
          {phase < 2 && <span className="sol-search-caret">|</span>}
        </div>
        {phase === 1 && (
          <span className="sol-search-spinner"/>
        )}
        {phase === 2 && (
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            <circle cx="10" cy="10" r="9" fill="#22c55e"/>
            <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Confirmation card, appears when phase 2 */}
      <div className={`sol-confirm-card ${phase === 2 ? "visible" : ""}`}>
        <div className="sol-confirm-header">
          <div className="sol-confirm-pin">
            <span className="material-icons" style={{fontSize:16,color:"#fe5e32"}}>place</span>
          </div>
          <div className="sol-confirm-info">
            <strong>742 Sutter St</strong>
            <span>San Francisco, CA 94109</span>
          </div>
          <div className="sol-confirm-pill">Verified</div>
        </div>
        <div className="sol-confirm-divider"></div>
        <div className="sol-confirm-stats">
          <div className="sol-confirm-stat">
            <span className="sol-confirm-stat-label">Window</span>
            <span className="sol-confirm-stat-val">3:00 – 5:00 PM</span>
          </div>
          <div className="sol-confirm-stat">
            <span className="sol-confirm-stat-label">ETA</span>
            <span className="sol-confirm-stat-val accent">~18 min</span>
          </div>
          <div className="sol-confirm-stat">
            <span className="sol-confirm-stat-label">Courier</span>
            <span className="sol-confirm-stat-val">Route #12</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Reschedule, map + conversation side by side ─────
function getRescheduleChat(es) {
  return es ? [
    { from: "agent", text: "¡Hola James! Confirmando entrega en Calle 85 #12-45 hoy entre 3 y 5 PM.", delay: 400 },
    { from: "user",  text: "Ah, en realidad me mudé la semana pasada. Mi nueva dirección es Calle 100 #20-30.", delay: 1800 },
    { from: "agent", text: "¡Perfecto! Estoy actualizando tu dirección ahora mismo…", delay: 3200 },
    { from: "agent", text: "Listo. Confirmado en Calle 100 #20-30, Bogotá. Misma ventana: 3–5 PM.", delay: 4600, confirm: true },
  ] : [
    { from: "agent", text: "Hi James! Confirming delivery to 742 Sutter St today 3–5 PM.", delay: 400 },
    { from: "user",  text: "Actually I moved last week, new address is 580 Post St.", delay: 1800 },
    { from: "agent", text: "Got it! Updating your delivery address right now...", delay: 3200 },
    { from: "agent", text: "Done. Confirmed to 580 Post St, SF. Same window: 3–5 PM.", delay: 4600, confirm: true },
  ];
}

function RescheduleView() {
  const outerRef    = useRef(null);
  const mapDivRef   = useRef(null);
  const mapObjRef   = useRef(null);
  const markerRef   = useRef(null);
  const bubblesRef  = useRef(null);
  const [messages, setMessages] = useState([]);
  const [mapPhase, setMapPhase] = useState("original");

  // Auto-scroll to latest bubble
  useEffect(() => {
    if (bubblesRef.current) {
      bubblesRef.current.scrollTo({ top: bubblesRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Entrance
  useEffect(() => {
    if (outerRef.current && typeof gsap !== "undefined") {
      gsap.fromTo(outerRef.current,
        { opacity: 0, scale: 0.92, y: 24, filter: "blur(8px)" },
        { opacity: 1, scale: 1,    y: 0,  filter: "blur(0px)", duration: 0.65, ease: "power3.out" }
      );
    }
  }, []);

  // Leaflet
  useEffect(() => {
    const L = window.L;
    if (!L || mapObjRef.current) return;
    const lat1 = 37.78769, lng1 = -122.41845;
    const map = L.map(mapDivRef.current, {
      center: [lat1, lng1], zoom: 16,
      zoomControl: false, attributionControl: false,
      scrollWheelZoom: false, dragging: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }).addTo(map);
    const mkIcon = (color) => L.divIcon({
      className: '',
      html: `<div class="map-live-pin"><div class="map-live-ring"></div><div class="map-live-dot" style="background:${color}"></div></div>`,
      iconSize: [40, 40], iconAnchor: [20, 20],
    });
    const marker = L.marker([lat1, lng1], { icon: mkIcon('#fe5e32') }).addTo(map);
    setTimeout(() => map.invalidateSize(), 100);
    mapObjRef.current = map;
    markerRef.current = { marker, mkIcon };
    return () => { map.remove(); mapObjRef.current = null; };
  }, []);

  // Chat sequence
  useEffect(() => {
    const timers = getRescheduleChat(isEsLang()).map(({ delay, from, text, confirm }) =>
      setTimeout(() => {
        setMessages(prev => [...prev, { from, text, confirm }]);
        if (confirm) {
          setTimeout(() => {
            setMapPhase("updating");
            const L = window.L;
            const map = mapObjRef.current;
            const { marker, mkIcon } = markerRef.current;
            if (!map || !L) return;
            const lat2 = 37.78620, lng2 = -122.41220;
            map.flyTo([lat2, lng2], 16, { duration: 1.8 });
            setTimeout(() => {
              marker.setLatLng([lat2, lng2]);
              marker.setIcon(mkIcon('#22c55e'));
              setMapPhase("updated");
            }, 1900);
          }, 500);
        }
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="sol-map-immersive resch-outer" ref={outerRef}>
      {/* Full-bleed map */}
      <div className="sol-map-immersive-body" ref={mapDivRef}></div>

      {/* Top status chip (same style as search bar in step 2) */}
      <div className="sol-search resch-status">
        <span className={`sol-map-status-dot ${mapPhase === "updated" ? "confirmed" : "scanning"}`}/>
        <div className="sol-search-text">
          {mapPhase === "updated" ? "Address updated to 580 Post St" : "Rescheduling delivery..."}
        </div>
        {mapPhase !== "updated" ? (
          <span className="sol-search-spinner"/>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            <circle cx="10" cy="10" r="9" fill="#22c55e"/>
            <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Confirmation card, bottom, appears when updated */}
      <div className={`sol-confirm-card ${mapPhase === "updated" ? "visible" : ""}`}>
        <div className="sol-confirm-header">
          <div className="sol-confirm-pin">
            <span className="material-icons" style={{fontSize:16,color:"#fe5e32"}}>place</span>
          </div>
          <div className="sol-confirm-info">
            <strong>580 Post St</strong>
            <span>San Francisco, CA 94102</span>
          </div>
          <div className="sol-confirm-pill">Updated</div>
        </div>
        <div className="sol-confirm-divider"></div>
        <div className="sol-confirm-stats">
          <div className="sol-confirm-stat">
            <span className="sol-confirm-stat-label">Window</span>
            <span className="sol-confirm-stat-val">3:00 – 5:00 PM</span>
          </div>
          <div className="sol-confirm-stat">
            <span className="sol-confirm-stat-label">ETA</span>
            <span className="sol-confirm-stat-val accent">~22 min</span>
          </div>
          <div className="sol-confirm-stat">
            <span className="sol-confirm-stat-label">Courier</span>
            <span className="sol-confirm-stat-val">Route #12</span>
          </div>
        </div>
      </div>

      {/* Floating chat card, hero style */}
      <div className="resch-chat-float">
        {/* Agent chip */}
        <div className="hcc-agent-chip" style={{marginBottom:10}}>
          <div className="hcc-av-agent">
            <img src="assets/icono-tangering.png" alt="" className="hcc-logo-img"/>
          </div>
          <div className="hcc-chip-info">
            <span className="hcc-name">Sarah</span>
            <span className="hcc-pill">AI AGENT</span>
          </div>
          <div className="hcc-chip-status">
            <svg viewBox="0 0 8 8" width="7" height="7"><circle cx="4" cy="4" r="4" fill="#4ade80"/></svg>
            online
          </div>
        </div>

        {/* Single message at a time */}
        <div className="resch-single-msg">
          {messages.length === 0 ? (
            <div className="hcc-row" key="typing">
              <div className="hcc-av-sm agent">
                <img src="assets/icono-tangering.png" alt="" className="hcc-av-img"/>
              </div>
              <div className="hcc-typing"><span/><span/><span/></div>
            </div>
          ) : (() => {
            const m = messages[messages.length - 1];
            const i = messages.length - 1;
            return (
              <div key={`${i}-${m.text.slice(0,10)}`} className={`hcc-row ${m.from === "user" ? "client" : ""} resch-msg-in`}>
                {m.from === "agent" && (
                  <div className="hcc-av-sm agent">
                    <img src="assets/icono-tangering.png" alt="" className="hcc-av-img"/>
                  </div>
                )}
                <div className={`hcc-bubble ${m.from === "user" ? "client" : "agent"}`}>
                  {m.text}
                  <span className="hcc-time">3:4{i+2}</span>
                </div>
                {m.from === "user" && (
                  <div className="hcc-av-sm client">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="rgba(255,255,255,0.85)">
                      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Courier WhatsApp notification ──────────────────────
function getCourierMsgs(es) {
  return es ? [
    { delay: 600,  side: "out", text: "Hola 👋 Tienes una entrega lista — Pedido #4521", time: "3:41" },
    { delay: 1900, side: "in",  text: "Listo, ¿cuál es la dirección?", time: "3:41" },
    { delay: 3100, side: "out", text: "📍 Calle 100 #20-30, Bogotá — apto 3B", time: "3:42" },
    { delay: 4300, side: "out", text: "🕐 Ventana de hoy: 3:00 – 5:00 PM", time: "3:42" },
    { delay: 5500, side: "out", text: "⚠️ Entrada lateral, timbre 3B", time: "3:42" },
    { delay: 6900, side: "in",  text: "Recibido, ya voy en camino 👍", time: "3:43" },
    { delay: 8200, side: "out", text: "✅ El cliente acaba de confirmar la entrega.", time: "3:43", confirm: true },
  ] : [
    { delay: 600,  side: "out", text: "Hey 👋 New delivery ready — Order #4521", time: "3:41" },
    { delay: 1900, side: "in",  text: "Got it, what's the address?", time: "3:41" },
    { delay: 3100, side: "out", text: "📍 580 Post St, San Francisco — apt 3B", time: "3:42" },
    { delay: 4300, side: "out", text: "🕐 Today's window: 3:00 – 5:00 PM", time: "3:42" },
    { delay: 5500, side: "out", text: "⚠️ Side entrance on Larkin St, ring 3B", time: "3:42" },
    { delay: 6900, side: "in",  text: "Got it, on my way 👍", time: "3:43" },
    { delay: 8200, side: "out", text: "✅ Customer just confirmed the delivery.", time: "3:43", confirm: true },
  ];
}

function CourierNotifyView() {
  const outerRef = useRef(null);
  const msgsRef  = useRef(null);
  const [items, setItems]   = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (outerRef.current && typeof gsap !== "undefined") {
      gsap.fromTo(outerRef.current,
        { opacity: 0, scale: 0.92, y: 24, filter: "blur(8px)" },
        { opacity: 1, scale: 1,    y: 0,  filter: "blur(0px)", duration: 0.65, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    const timers = [];
    getCourierMsgs(isEsLang()).forEach((msg, idx) => {
      if (msg.side === "out") {
        timers.push(setTimeout(() => setTyping("out"), msg.delay - 500));
      } else {
        timers.push(setTimeout(() => setTyping("in"), msg.delay - 700));
      }
      timers.push(setTimeout(() => {
        setTyping(false);
        setItems(prev => [...prev, msg]);
      }, msg.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [items]);

  return (
    <div className="courier-outer" ref={outerRef}>
      {/* iPhone 17 frame */}
      <div className="ip17">
        <div className="ip17-action"/><div className="ip17-vol-up"/>
        <div className="ip17-vol-dn"/><div className="ip17-power"/>
        <div className="ip17-screen">
          <div className="ip17-island"></div>

          {/* WhatsApp UI */}
          <div className="wa-app">
            {/* Status bar, same row as island */}
            <div className="wa-status-bar">
              <span className="wa-time">9:40</span>
              <div className="wa-status-right">
                {/* Signal */}
                <svg viewBox="0 0 17 12" fill="#000" width="17" height="12">
                  <rect x="0"    y="8"   width="3" height="4"  rx="0.5"/>
                  <rect x="4.5"  y="5.5" width="3" height="6.5" rx="0.5"/>
                  <rect x="9"    y="3"   width="3" height="9"  rx="0.5"/>
                  <rect x="13.5" y="0"   width="3" height="12" rx="0.5"/>
                </svg>
                {/* WiFi */}
                <svg viewBox="0 0 16 12" fill="#000" width="16" height="12">
                  <path d="M8 2.5C5.5 2.5 3.3 3.4 1.6 5L0 3.3C2.1 1.3 4.9 0 8 0s5.9 1.3 8 3.3L14.4 5C12.7 3.4 10.5 2.5 8 2.5z" opacity="0.4"/>
                  <path d="M8 5.7c-1.7 0-3.2.7-4.3 1.7L2.1 5.8C3.6 4.4 5.7 3.5 8 3.5s4.4.9 5.9 2.3L12.3 7.4C11.2 6.4 9.7 5.7 8 5.7z" opacity="0.7"/>
                  <path d="M8 8.9c-.8 0-1.5.3-2.1.8L8 12l2.1-2.3C9.5 9.2 8.8 8.9 8 8.9z"/>
                </svg>
                {/* Battery */}
                <svg viewBox="0 0 26 13" fill="none" width="26" height="13">
                  <rect x="0.5" y="0.5" width="22" height="12" rx="3" stroke="#000" strokeOpacity="0.35"/>
                  <rect x="2" y="2" width="18" height="9" rx="1.5" fill="#000"/>
                  <rect x="23.5" y="4" width="2" height="5" rx="1" fill="#000" fillOpacity="0.4"/>
                </svg>
              </div>
            </div>

            {/* WA Header */}
            <div className="wa-header">
              <span className="material-icons wa-back-icon">arrow_back_ios</span>
              <div className="wa-header-av">
                <svg viewBox="0 0 40 40" width="40" height="40">
                  <defs>
                    <linearGradient id="wa-av-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"  stopColor="#fe5e32"/>
                      <stop offset="100%" stopColor="#ff9b75"/>
                    </linearGradient>
                  </defs>
                  <rect width="40" height="40" rx="20" fill="url(#wa-av-grad)"/>
                  <circle cx="20" cy="15" r="8" fill="rgba(255,255,255,0.92)"/>
                  <ellipse cx="20" cy="35" rx="14" ry="10" fill="rgba(255,255,255,0.92)"/>
                </svg>
              </div>
              <div className="wa-header-info">
                <div className="wa-header-name">Courier #12</div>
                <div className="wa-header-sub">Online</div>
              </div>
              <div className="wa-header-icons">
                <span className="material-icons wa-hdr-icon">videocam</span>
                <span className="material-icons wa-hdr-icon">more_vert</span>
              </div>
            </div>

            {/* Chat area */}
            <div className="wa-chat" ref={msgsRef}>
              <div className="wa-date-label">Today</div>

              {items.map((m, i) => (
                <div key={i} className={`wa-row ${m.side === "out" ? "wa-row-out" : "wa-row-in"}`}>
                  <div className="wa-msg-group">
                    <div className={`wa-bubble ${m.side === "out" ? "wa-bubble-out" : "wa-bubble-in"}`}>
                      <span className="wa-bubble-text">{m.text}</span>
                    </div>
                    <div className={`wa-ts ${m.side === "out" ? "wa-ts-out" : "wa-ts-in"}`}>
                      {m.time}
                      {m.side === "out" && (
                        <svg viewBox="0 0 18 11" fill="none" width="18" height="11">
                          <path d="M1 5.5l3 3L12 1" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 5.5l3 3L17 1" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className={`wa-row ${typing === "out" ? "wa-row-out" : "wa-row-in"}`}>
                  <div className="wa-msg-group">
                    <div className={`wa-bubble ${typing === "out" ? "wa-bubble-out" : "wa-bubble-in"}`}>
                      <div className="wa-typing"><span/><span/><span/></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="wa-input-bar">
              <span className="material-icons wa-add-icon">add_circle</span>
              <div className="wa-input-field">
                <span className="material-icons wa-field-icon">mood</span>
                <span className="wa-input-placeholder">Message</span>
                <span className="material-icons wa-field-icon">camera_alt</span>
              </div>
              <div className="wa-mic-btn">
                <span className="material-icons">mic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 5: CRM updating in real time ─────────────────────────
function CRMUpdateView() {
  const outerRef = useRef(null);
  const [phase, setPhase] = useState(0); // 0=initial 1=updating 2=address 3=status 4=done

  useEffect(() => {
    if (outerRef.current && typeof gsap !== "undefined") {
      gsap.fromTo(outerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "all" }
      );
    }
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1900),
      setTimeout(() => setPhase(3), 3100),
      setTimeout(() => setPhase(4), 4300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const isSyncing = phase >= 1 && phase < 4;
  const isDone    = phase >= 4;

  return (
    <div className="crmv2-outer" ref={outerRef}>
      {/* Sync status pill (matches map/reschedule style) */}
      <div className="sol-search crmv2-status">
        <span className="material-icons" style={{fontSize:16,color:"#71717a"}}>{isDone ? "check_circle" : "sync"}</span>
        <div className="sol-search-text">
          {isDone ? "Synced to CRM · all systems updated" : isSyncing ? "Syncing order #4521..." : "Connected to crm.tangering.io"}
        </div>
        {isSyncing && <span className="sol-search-spinner"/>}
      </div>

      {/* Big focused order card, the one being updated */}
      <div className={`crmv2-card ${isSyncing ? "is-updating" : ""} ${isDone ? "is-done" : ""}`}>
        <div className="crmv2-card-top">
          <div>
            <div className="crmv2-order-id">Order #4521</div>
            <div className="crmv2-customer">James Carter</div>
          </div>
          <div className={`crmv2-pill ${isDone ? "ok" : isSyncing ? "sync" : "neutral"}`}>
            {isSyncing && <span className="crmv2-spin"/>}
            {isDone ? "Confirmed" : isSyncing ? "Updating" : "Scheduled"}
          </div>
        </div>

        {/* Address field, live update */}
        <div className="crmv2-field">
          <div className="crmv2-field-label">Delivery address</div>
          <div className="crmv2-field-value">
            <span className={`crmv2-addr-old ${phase >= 2 ? "fade-out" : ""}`}>742 Sutter St</span>
            {phase >= 2 && (
              <>
                <span className="crmv2-arrow">→</span>
                <span className="crmv2-addr-new">580 Post St</span>
                <span className="crmv2-changed-tag">updated</span>
              </>
            )}
          </div>
        </div>

        <div className="crmv2-row-split">
          <div className="crmv2-field crmv2-field-half">
            <div className="crmv2-field-label">Window</div>
            <div className="crmv2-field-value-sm">3:00 – 5:00 PM</div>
          </div>
          <div className="crmv2-field crmv2-field-half">
            <div className="crmv2-field-label">Courier</div>
            <div className="crmv2-field-value-sm">Route #12</div>
          </div>
        </div>
      </div>

      {/* Activity feed, compact, glass */}
      <div className="crmv2-activity">
        <div className="crmv2-act-head">
          <span className="material-icons" style={{fontSize:14, color:"#fe5e32"}}>bolt</span>
          Activity
        </div>
        {[
          { t: "Address updated",  d: "742 Sutter St → 580 Post St",  show: phase >= 2, color: "#fe5e32" },
          { t: "Status confirmed", d: "Order #4521 → Confirmed",      show: phase >= 3, color: "#22c55e" },
          { t: "Webhook fired",    d: "POST /api/orders/sync · 200",  show: phase >= 4, color: "#1a1a2e" },
        ].filter(a => a.show).map((a, i) => (
          <div key={i} className="crmv2-act-item">
            <div className="crmv2-act-dot" style={{background: a.color}}/>
            <div className="crmv2-act-text">
              <strong>{a.t}</strong>
              <span>{a.d}</span>
            </div>
            <div className="crmv2-act-time">just now</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── iPhone 17 Solution Phone ──────────────────────────────────
const CALL_AUDIO_URL = "https://media.vocaroo.com/mp3/1kEa2KjGICxl";

function SolutionPhone({ step }) {
  const [tick, setTick] = useState(step * 5);
  const [audioOn, setAudioOn] = useState(false);
  const txRef = useRef(null);
  const audioRef = useRef(null);

  // Timer
  useEffect(() => {
    setTick(step * 5);
    if (step === 4) return;
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [step]);

  // Auto-play audio when step 0 (call) is active
  useEffect(() => {
    if (!audioRef.current) return;
    if (step === 0) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.then(() => setAudioOn(true)).catch(() => setAudioOn(false));
      }
    } else {
      audioRef.current.pause();
      setAudioOn(false);
    }
  }, [step]);

  // Track when audio ends
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => setAudioOn(false);
    a.addEventListener("ended", onEnd);
    return () => a.removeEventListener("ended", onEnd);
  }, []);

  useEffect(() => {
    if (txRef.current) txRef.current.scrollTop = txRef.current.scrollHeight;
  });

  const isEnded  = step === 4;
  const isMap    = step === 1;   // step 2 = map verification
  const isIncoming = false;
  const mins = Math.floor(tick / 60);
  const secs = tick % 60;
  const timerStr = `${mins}:${String(secs).padStart(2, "0")}`;
  const transcript = getCallTranscript(isEsLang()).slice(0, step + 1).flat();
  const BARS = [3,6,11,18,24,18,12,20,14,8,22,15,9,19,11,6,16,10,4,14,8,22,15,9,6];

  return (
    <div className="ip17-wrap sol-phone-wrap">
      <div className="ip17">
        <div className="ip17-action"></div>
        <div className="ip17-vol-up"></div>
        <div className="ip17-vol-dn"></div>
        <div className="ip17-power"></div>
        <div className="ip17-screen">
          <div className="ip17-island"></div>

          {/* Step 0, Incoming */}
          {isIncoming && (
            <div className="ip17-incoming">
              <p className="ip17-incoming-label">Llamada entrante</p>
              <div className="ip17-avatar-ring">
                <div className="ip17-avatar-ring2"></div>
                <div className="ip17-avatar"><span>S</span></div>
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

          {/* Step 2, standalone map card (real Leaflet map) */}

          {/* Steps 1, 3-4, Active / Ended, iOS native call UI */}
          {!isIncoming && !isMap && (
            <div className="ip17-ios-call">
              {/* Status bar */}
              <div className="ip17-ios-status">
                <span className="ip17-ios-time">3:41</span>
                <div className="ip17-ios-status-right">
                  {/* Signal bars */}
                  <svg viewBox="0 0 20 14" fill="white" width="20" height="14">
                    <rect x="0"   y="10" width="3.5" height="4"  rx="0.5"/>
                    <rect x="4.5" y="7"  width="3.5" height="7"  rx="0.5"/>
                    <rect x="9"   y="4"  width="3.5" height="10" rx="0.5"/>
                    <rect x="13.5" y="1" width="3.5" height="13" rx="0.5"/>
                  </svg>
                  {/* WiFi */}
                  <svg viewBox="0 0 16 12" fill="white" width="16" height="12">
                    <path d="M8 2.4C5.6 2.4 3.4 3.3 1.7 4.8L0 3.1C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.1L14.3 4.8C12.6 3.3 10.4 2.4 8 2.4z" opacity="0.5"/>
                    <path d="M8 5.6c-1.6 0-3.1.6-4.2 1.7L2.1 5.6C3.6 4.2 5.7 3.3 8 3.3s4.4.9 5.9 2.3L12.2 7.3C11.1 6.2 9.6 5.6 8 5.6z" opacity="0.75"/>
                    <path d="M8 8.8c-.8 0-1.6.3-2.1.8L8 12l2.1-2.4C9.6 9.1 8.8 8.8 8 8.8z"/>
                  </svg>
                  {/* Battery */}
                  <svg viewBox="0 0 28 13" fill="none" width="28" height="13">
                    <rect x="0.5" y="0.5" width="23" height="12" rx="3" stroke="white" strokeOpacity="0.4"/>
                    <rect x="2" y="2" width="18" height="9" rx="1.5" fill="white"/>
                    <path d="M25 4.5v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/>
                    <text x="3" y="10" fontSize="8" fill="#1c1c1e" fontWeight="bold">79</text>
                  </svg>
                </div>
              </div>

              {/* Caller info */}
              <div className="ip17-ios-caller">
                <p className="ip17-ios-name">Sarah</p>
                <p className="ip17-ios-duration">{isEnded ? "llamada terminada" : timerStr}</p>
              </div>

              {/* Hidden audio, plays during step 0 (no visible UI inside phone) */}
              {step === 0 && (
                <audio ref={audioRef} src={CALL_AUDIO_URL} preload="auto" playsInline
                       style={{display:'none'}}/>
              )}

              {/* Spacer */}
              <div className="ip17-ios-spacer">
                {isEnded && (
                  <div className="ip17-ios-confirmed">
                    <svg viewBox="0 0 24 24" fill="none" width="44" height="44"><circle cx="12" cy="12" r="11" fill="#22c55e"/><path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Entrega confirmada</span>
                    <small>#4521</small>
                  </div>
                )}
              </div>

              {/* 6-button iOS grid */}
              <div className="ip17-ios-grid">
                {[
                  { label: "mute",     svg: <svg viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/><line x1="3" y1="3" x2="21" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg> },
                  { label: "keypad",   svg: <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><circle cx="6" cy="6" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="18" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/><circle cx="6" cy="18" r="1.6"/><circle cx="12" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/></svg> },
                  { label: "speaker",  svg: <svg viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg> },
                  { label: "add call", svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> },
                  { label: "FaceTime", svg: <svg viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg> },
                  { label: "contacts", svg: <svg viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
                ].map((c, i) => (
                  <div key={i} className="ip17-ios-btn">
                    <div className="ip17-ios-btn-circle">{c.svg}</div>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>

              {/* End call button, separate, centered */}
              <div className="ip17-ios-end-wrap">
                <button className="ip17-ios-end-btn">
                  <svg viewBox="0 0 24 24" fill="white" width="30" height="30"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08A.996.996 0 010 12.37c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 00-2.67-1.85c-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CallModal({ step }) {
  const [tick, setTick] = useState(step * 5);

  useEffect(() => {
    setTick(step * 5);
    if (step === 4) return;
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [step]);

  const isEnded = step === 4;
  const mins = Math.floor(tick / 60);
  const secs = tick % 60;
  const timerStr = `${mins}:${String(secs).padStart(2,"0")}`;

  const transcript = getCallTranscript(isEsLang()).slice(0, step + 1).flat();

  const BARS = [3,6,11,18,24,18,12,20,14,8,22,15,9,19,11,6,16,10,4];

  return (
    <div className="cm-scene" key={step}>

      {/* ── Glass pill ── */}
      <div className={`cm-pill ${isEnded ? "cm-pill-ended" : ""}`}>

        {/* Tangering avatar */}
        <img src="assets/icono-tangering.png" className="cm-av cm-av-agent" alt=""/>

        {/* waveform, flex:1 fills the middle */}
        <div className="cm-wave">
          {BARS.map((h, i) => (
            <div key={i} className="cm-bar" style={{
              height: !isEnded ? `${h}px` : "3px",
              animationDuration: `${0.42 + (i % 7) * 0.09}s`,
              animationDelay: `${i * 0.032}s`,
            }}/>
          ))}
        </div>

        {/* right controls: timer + hang-up */}
        <div className="cm-pill-right">
          <div className="cm-timer-pill">
            <svg viewBox="0 0 24 24" width="12" height="12" fill={isEnded ? "#ef4444" : "#4ade80"}>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C6.44 21 2 16.56 2 11c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.26.2 2.46.57 3.58.11.35.02.74-.24 1.02L6.6 10.8z"/>
            </svg>
            <span style={{ color: isEnded ? "#ef4444" : "#4ade80" }}>
              {isEnded ? "ended" : timerStr}
            </span>
          </div>

          <div className="cm-end-btn">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="white">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08A.996.996 0 0 1 0 12.37c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85c-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Transcript glass card ── */}
      <div className="cm-transcript">
        <div className="cm-tx-header">
          <div className="cm-tx-dot"></div>
          <span>Live Transcript</span>
        </div>
        <div className="cm-tx-messages">
          {transcript.map((line, i) => {
            if (line.agent === null) {
              return (
                <div key={i} className="cm-tx-row cm-tx-system" style={{ animationDelay:`${i * 0.1}s` }}>
                  <span className="cm-tx-system-text">{line.msg}</span>
                </div>
              );
            }
            return (
              <div key={i} className={`cm-tx-row ${line.agent ? "cm-tx-agent" : "cm-tx-client"}`}
                   style={{ animationDelay:`${i * 0.1}s` }}>
                {line.agent && (
                  <div className="cm-tx-av cm-tx-av-agent">
                    <img src="assets/icono-tangering.png" width="20" height="20"
                         style={{ borderRadius:"50%", objectFit:"cover", display:"block" }}/>
                  </div>
                )}
                <div className={`cm-tx-bubble ${line.agent ? "cm-tx-bubble-agent" : "cm-tx-bubble-client"}`}>
                  {line.msg}
                </div>
                {!line.agent && (
                  <div className="cm-tx-av cm-tx-av-client">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="rgba(255,255,255,0.85)">
                      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function MapStage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  const events = CALL_EVENTS[1]; // step 1 events

  return (
    <div className="map-stage">

      {/* ── Street map SVG ── */}
      <div className="map-view">
        <svg viewBox="0 0 400 280" className="map-svg" preserveAspectRatio="xMidYMid slice">
          {/* base land */}
          <rect width="400" height="280" fill="#f2efe9"/>

          {/* park top-left */}
          <rect x="8" y="8" width="96" height="76" rx="3" fill="#c8e6b0"/>
          <rect x="14" y="14" width="84" height="64" rx="2" fill="#bbe07e" opacity="0.35"/>
          <rect x="8" y="8" width="96" height="76" rx="3" fill="none" stroke="#b0d890" strokeWidth="0.8"/>

          {/* water right edge */}
          <rect x="340" y="0" width="60" height="280" fill="#c2dcf0"/>
          <path d="M340 0 Q336 35 340 70 Q344 105 340 140 Q336 175 340 210 Q344 245 340 280" stroke="#aaceea" strokeWidth="1.5" fill="none"/>

          {/* main horizontal road (Elm Street) */}
          <rect x="0" y="112" width="340" height="14" fill="white"/>
          <line x1="0" y1="119" x2="340" y2="119" stroke="#e0dbd0" strokeWidth="0.5" strokeDasharray="10 6"/>
          <rect x="0" y="112" width="340" height="0.8" fill="#d8d4cc"/>
          <rect x="0" y="125.2" width="340" height="0.8" fill="#d8d4cc"/>

          {/* main vertical road */}
          <rect x="134" y="0" width="14" height="280" fill="white"/>
          <line x1="141" y1="0" x2="141" y2="280" stroke="#e0dbd0" strokeWidth="0.5" strokeDasharray="10 6"/>
          <rect x="134" y="0" width="0.8" height="280" fill="#d8d4cc"/>
          <rect x="147.2" y="0" width="0.8" height="280" fill="#d8d4cc"/>

          {/* secondary horizontal roads */}
          <rect x="0" y="56" width="134" height="8" fill="#ede9e1"/>
          <rect x="148" y="56" width="192" height="8" fill="#ede9e1"/>
          <rect x="0" y="186" width="134" height="8" fill="#ede9e1"/>
          <rect x="148" y="186" width="192" height="8" fill="#ede9e1"/>
          <rect x="0" y="248" width="134" height="8" fill="#ede9e1"/>
          <rect x="148" y="248" width="192" height="8" fill="#ede9e1"/>

          {/* secondary vertical roads */}
          <rect x="64" y="0" width="8" height="112" fill="#ede9e1"/>
          <rect x="64" y="126" width="8" height="154" fill="#ede9e1"/>
          <rect x="208" y="0" width="8" height="112" fill="#ede9e1"/>
          <rect x="208" y="126" width="8" height="154" fill="#ede9e1"/>
          <rect x="278" y="0" width="8" height="112" fill="#ede9e1"/>
          <rect x="278" y="126" width="8" height="154" fill="#ede9e1"/>

          {/* buildings top-right blocks */}
          <rect x="156" y="8"  width="46" height="44" rx="1" fill="#e0ddd5"/>
          <rect x="216" y="8"  width="57" height="44" rx="1" fill="#d8d5cd"/>
          <rect x="290" y="8"  width="44" height="44" rx="1" fill="#e4e1d9"/>
          <rect x="156" y="64" width="46" height="42" rx="1" fill="#d8d5cd"/>
          <rect x="216" y="64" width="57" height="42" rx="1" fill="#e0ddd5"/>
          <rect x="290" y="64" width="44" height="42" rx="1" fill="#dddad2"/>

          {/* buildings bottom-left blocks */}
          <rect x="8"  y="130" width="50" height="50" rx="1" fill="#e0ddd5"/>
          <rect x="72" y="130" width="56" height="50" rx="1" fill="#d8d5cd"/>
          <rect x="8"  y="194" width="50" height="48" rx="1" fill="#dddad2"/>
          <rect x="72" y="194" width="56" height="48" rx="1" fill="#e0ddd5"/>
          <rect x="8"  y="256" width="50" height="24" rx="1" fill="#d8d5cd"/>
          <rect x="72" y="256" width="56" height="24" rx="1" fill="#e4e1d9"/>

          {/* buildings bottom-right blocks */}
          <rect x="156" y="130" width="46" height="50" rx="1" fill="#dddad2"/>
          <rect x="216" y="130" width="57" height="50" rx="1" fill="#e0ddd5"/>
          <rect x="290" y="130" width="44" height="50" rx="1" fill="#d8d5cd"/>
          <rect x="156" y="194" width="46" height="48" rx="1" fill="#e0ddd5"/>
          <rect x="216" y="194" width="57" height="48" rx="1" fill="#dddad2"/>
          <rect x="290" y="194" width="44" height="48" rx="1" fill="#e4e1d9"/>
          <rect x="156" y="256" width="46" height="24" rx="1" fill="#d8d5cd"/>
          <rect x="216" y="256" width="57" height="24" rx="1" fill="#e0ddd5"/>
          <rect x="290" y="256" width="44" height="24" rx="1" fill="#dddad2"/>

          {/* highlight target building */}
          <rect x="8" y="130" width="50" height="50" rx="1" fill="#fe5e32" opacity="0.12"/>
          <rect x="8" y="130" width="50" height="50" rx="1" fill="none" stroke="#fe5e32" strokeWidth="1.8"/>

          {/* street labels */}
          <text x="170" y="122" fontSize="6" fill="#aaa" fontFamily="sans-serif">Elm Street</text>
          <text x="136" y="50" fontSize="6" fill="#aaa" fontFamily="sans-serif" transform="rotate(-90 136 50)">Main Ave</text>
        </svg>

        {/* animated location pin */}
        <div className={`map-pin-wrap ${ready ? "map-pin-in" : ""}`} style={{ left:"9%", top:"49%" }}>
          <div className="map-pulse-ring r1"></div>
          <div className="map-pulse-ring r2"></div>
          <div className="map-pin-dot">
            <svg viewBox="0 0 24 30" width="32" height="32" fill="#fe5e32">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 7.5 12 18 12 18s12-10.5 12-18C24 5.4 18.6 0 12 0zm0 16a4 4 0 110-8 4 4 0 010 8z"/>
            </svg>
          </div>
        </div>

        {/* fake map controls */}
        <div className="map-zoom-ctrl">
          <div className="map-zoom-btn">+</div>
          <div className="map-zoom-sep"></div>
          <div className="map-zoom-btn">−</div>
        </div>

        {/* map attribution */}
        <div className="map-attr">© Map</div>
      </div>

      {/* ── Confirmation card ── */}
      <div className={`map-card ${ready ? "map-card-in" : ""}`}>
        <div className="map-card-top">
          <div className="map-check-circle">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <div className="map-card-title">Address Confirmed</div>
            <div className="map-card-sub">Geocoding verified · real-time</div>
          </div>
          <div className="map-live-dot"><span></span>LIVE</div>
        </div>

        <div className="map-card-address">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fe5e32" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>742 Elm Street · Delivery 3–5 PM today</span>
        </div>

        <div className="map-card-events">
          {events.map((ev, i) => {
            const tag = ev.label.match(/\[(\w+)\]/)?.[1] || "SYS";
            const text = ev.label.replace(/\[\w+\]\s*/, "");
            return (
              <div key={i} className="map-ev-row" style={{ animationDelay:`${i * 0.18}s` }}>
                <span className="map-ev-tag" style={{ color: ev.color }}>{tag}</span>
                <span className="map-ev-text">{text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WaveBar({ active }) {
  const bars = [3,6,10,14,10,7,12,9,5,11,8,13,6,10,4];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 1.5, height: 16 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 2, borderRadius: 1,
          height: active ? `${h}px` : "3px",
          background: "rgba(255,255,255,0.6)",
          transition: `height ${0.3 + i * 0.04}s ease`,
          animation: active ? `wave-pulse ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate` : "none",
        }} />
      ))}
    </div>
  );
}

function SolutionStage({ step }) {
  const [tick, setTick] = useState(step * 5);

  useEffect(() => {
    setTick(step * 5);
    if (step === 4) return;
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [step]);

  const isEnded = step === 4;
  const mins = Math.floor(tick / 60);
  const secs = tick % 60;
  const timerStr = `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  const allEvents = CALL_EVENTS.slice(0, step + 1).flat();
  const recentEvents = allEvents.slice(-2);

  /* ── inline SVG icons (no emoji) ── */
  const IconMute = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
      <path d="M12 1a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
      <line x1="3" y1="3" x2="21" y2="21"/>
    </svg>
  );
  const IconKeypad = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
      {[4,12,20].flatMap(x => [5,11,17].map(y => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2"/>
      )))}
    </svg>
  );
  const IconSpeaker = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  );
  const IconAdd = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="26" height="26">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
  const IconVideo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  );
  const IconContact = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const BTNS = [
    { label:"Mute (off)", Icon:IconMute,    active:false },
    { label:"Teclado",    Icon:IconKeypad,  active:false },
    { label:"Altavoz",    Icon:IconSpeaker, active:true  },
    { label:"Añadir",     Icon:IconAdd,     active:false },
    { label:"FaceTime",   Icon:IconVideo,   active:false },
    { label:"Contactos",  Icon:IconContact, active:false },
  ];

  return (
    <div className="ios-call-screen">

      {/* ── status bar (left + right of Dynamic Island) ── */}
      <div className="ios-statusbar">
        <span className="ios-time">9:41</span>
        <div className="ios-status-icons">
          <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
            <rect x="0"  y="6" width="2.5" height="5"  rx="0.7"/>
            <rect x="3.5" y="4" width="2.5" height="7" rx="0.7"/>
            <rect x="7"  y="2" width="2.5" height="9"  rx="0.7"/>
            <rect x="10.5" y="0" width="2.5" height="11" rx="0.7"/>
          </svg>
          <span className="ios-5g">5G</span>
          <div className="ios-battery">
            <div className="ios-battery-fill"></div>
            <div className="ios-battery-cap"></div>
          </div>
        </div>
      </div>

      {/* ── caller info ── */}
      <div className="ios-caller-name">Tangering</div>
      <div className="ios-caller-status">
        {isEnded ? "Llamada terminada" : "Llamando"}
      </div>

      {/* ── avatar + pulse rings ── */}
      <div className="ios-avatar-wrap">
        {!isEnded && [0, 0.8, 1.6].map((delay, i) => (
          <div key={i} className="ios-ring" style={{
            width: 90 + i * 26, height: 90 + i * 26,
            opacity: 0.38 - i * 0.1,
            animationDelay: `${delay}s`,
          }}/>
        ))}
        <img src="assets/icono-tangering.png" className="ios-avatar-img"/>
      </div>

      {/* ── timer ── */}
      <div className="ios-timer">
        {isEnded ? "00:22" : timerStr}
      </div>

      {/* ── 3×2 circular buttons ── */}
      <div className="ios-btns-grid">
        {BTNS.map(({ label, Icon, active }, i) => (
          <div key={i} className="ios-btn-cell">
            <div className={`ios-btn-circle ${active ? "ios-btn-active" : ""}`}>
              <Icon/>
            </div>
            <span className="ios-btn-label">{label}</span>
          </div>
        ))}
      </div>

      {/* ── red hang-up ── */}
      <div className="ios-hangup-wrap">
        <div className="ios-hangup-btn">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C6.44 21 2 16.56 2 11c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.26.2 2.46.57 3.58.11.35.02.74-.24 1.02L6.6 10.8z" transform="rotate(135 12 12)"/>
          </svg>
        </div>
      </div>

      {/* ── live events (small ticker) ── */}
      {recentEvents.length > 0 && (
        <div className="ios-events-ticker">
          <div className="ios-events-label">Tangering AI · Live</div>
          {recentEvents.map((ev, i) => {
            const tag = ev.label.match(/\[(\w+)\]/)?.[1] || "SYS";
            const text = ev.label.replace(/\[\w+\]\s*/, "");
            return (
              <div key={i} className="ios-event-row">
                <span style={{ color: ev.color }}>{tag}</span>
                <span>{text}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── home indicator ── */}
      <div className="ios-home-bar"></div>
    </div>
  );
}

// Odometer, each digit animates individually when it changes
function OdoCounter({ count }) {
  const formatted = count.toLocaleString("es-CO"); // e.g. "1.842.395"
  return (
    <div className="odo-wrap">
      {formatted.split("").map((ch, i) => {
        if (ch === "." || ch === ",") {
          return <span key={`sep-${i}`} className="odo-sep">{ch}</span>;
        }
        return (
          <span key={`${i}-${ch}`} className="odo-digit">
            {ch}
          </span>
        );
      })}
    </div>
  );
}

function SocialProof({ t }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [count, setCount] = useState(1842391);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const iv = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 3) + 1);
    }, 1800);
    return () => clearInterval(iv);
  }, [inView]);

  // GSAP metrics stagger
  useEffect(() => {
    if (typeof gsap === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    gsap.from(section.querySelectorAll(".proof-metric"), {
      opacity: 0, x: 50,
      duration: 0.7, ease: "power3.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: section.querySelector(".proof-right"),
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    gsap.from(section.querySelector(".proof-left"), {
      opacity: 0, x: -50,
      duration: 0.9, ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  const results = [
    { text: t.proof.t1n, desc: t.proof.t1d, co: t.proof.t1w, color: "#22c55e" },
    { text: t.proof.t2n, desc: t.proof.t2d, co: t.proof.t2w, color: "#fe5e32" },
    { text: t.proof.t3n, desc: t.proof.t3d, co: t.proof.t3w, color: "var(--dark)" },
  ];

  return (
    <section className="proof" data-screen-label="04 Social proof" ref={(el) => { ref.current = el; sectionRef.current = el; }}>
      <div className="container">
        <div className="proof-layout">

          {/* ── Left column ── */}
          <div className="proof-left">
            <FadeUp>
              <div className="eyebrow">
                <span className="pulse"></span>
                {t.proof.eyebrowt}
              </div>
            </FadeUp>

            <FadeUp delay={60} className="proof-counter-wrap">
              <div className="proof-live-badge">
                <span className="proof-live-dot"></span>
                en producción ahora mismo
              </div>
              <OdoCounter count={count} />
              <p className="proof-counter-label">{t.proof.counterLabel}</p>
            </FadeUp>

            <FadeUp delay={120}>
              <h2 className="proof-h2">
                {t.proof.h2a}<br/>
                <em className="proof-em">{t.proof.h2b}</em>
              </h2>
            </FadeUp>

            <FadeUp delay={180}>
              <p className="proof-sub">{t.proof.sub}</p>
            </FadeUp>
          </div>

          {/* ── Right column: stacked metrics ── */}
          <div className="proof-right">
            {results.map((r, i) => (
              <FadeUp key={i} delay={i * 80} className="proof-metric" style={{ "--mc": r.color }}>
                <div className="proof-metric-row">
                  <div className="proof-metric-num" style={{ color: r.color }}>
                    {r.text ? r.text : <CountUp to={r.num} prefix={r.prefix} suffix={r.suffix} duration={1800} />}
                  </div>
                  <div className="proof-metric-body">
                    <p className="proof-metric-desc">{r.desc}</p>
                    <div className="proof-metric-co">{r.co}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function UseCases({ t }) {
  const cases = [
    {
      num: t.uc.c1n, title: t.uc.c1t, desc: t.uc.c1d, accent: "var(--orange)",
      chips: ["Voice", "WhatsApp", "TMS sync"],
      detail: "Voice or WhatsApp the day before delivery. Captures special instructions, locks the time window and writes the confirmed address straight to your TMS — no manual logging."
    },
    {
      num: t.uc.c2n, title: t.uc.c2t, desc: t.uc.c2d, accent: "var(--dark)",
      chips: ["Live panel", "Take-over", "Smart alerts"],
      detail: "Listen-in on any live call, jump into a WhatsApp thread with one click, or set automatic alerts so the team only intervenes when a conversation actually needs them."
    },
    {
      num: t.uc.c3n, title: t.uc.c3t, desc: t.uc.c3d, accent: "#6b9c30",
      chips: ["Voice", "WhatsApp", "SMS"],
      detail: "Same agent answers voice, WhatsApp and SMS. Tracks orders, opens returns, resolves doubts in your customer's language and hands off to a human only when judgment is required."
    },
    {
      num: t.uc.c4n, title: t.uc.c4t, desc: t.uc.c4d, accent: "#c66a99",
      chips: ["Smart retries", "CRM write-back", "Auto reschedule"],
      detail: "Smart backoff across channels until the customer responds. Fixes the address on the CRM in real time, reschedules the delivery and notifies the courier — without a single human escalation."
    },
  ];
  return (
    <section className="usecases" id="cases" data-screen-label="05 Use cases">
      <div className="container">
        <FadeUp>
          <div className="eyebrow">
            <span className="pulse"></span>
            {t.uc.eyebrow}
          </div>
        </FadeUp>
        <FadeUp delay={100}>
          <h2 style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: t.uc.h2.replace(/your operation|tu operación/, '<em>$&</em>') }} />
        </FadeUp>
        <FadeUp delay={200}>
          <p className="lead" style={{ marginTop: 20, maxWidth: 540 }}>{t.uc.sub}</p>
        </FadeUp>

        <div className="uc-grid">
          {cases.map((c, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div className="uc-card" style={{ "--accent": c.accent }}>
                <div className="uc-num">{c.num} / 04</div>
                <div className="uc-content">
                  <div className="uc-title">{c.title}</div>
                  <div className="uc-desc">{c.desc}</div>
                  <div className="uc-chips">
                    {c.chips.map((chip, j) => <span key={j}>{chip}</span>)}
                  </div>
                  <div className="uc-detail"><p>{c.detail}</p></div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveResults({ t }) {
  return (
    <section className="live-results" data-screen-label="04b Live results">
      <div className="container">
        <FadeUp className="live-head">
          <span className="eyebrow eyebrow-accent"><span className="pulse"></span> Customers love it</span>
          <h2>
            Live results, <em>and our biggest</em> US logo moving.
          </h2>
        </FadeUp>

        <div className="live-grid">
          <FadeUp delay={120}>
            <div className="live-card live-card-teal">
              <div className="live-card-label">BLUE EXPRESS</div>
              <p className="live-card-meta">Our agent Bea, live</p>
              <div className="live-card-metric">
                <span className="from">78%</span>
                <span className="arrow material-icons">arrow_forward</span>
                <span className="to">80.8%</span>
              </div>
              <p className="live-card-metric-label">pickup rate</p>
              <p className="live-card-copy">+2.8 points of first-attempt pickup, every point is a redelivery they never have to pay for.</p>
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <div className="live-card live-card-orange">
              <div className="live-card-label">ESTES FINAL MILE</div>
              <p className="live-card-meta">Largest private last-mile operator in the US</p>
              <div className="live-card-status">
                <div className="status-check"><span className="material-icons">check</span></div>
                <span>Technical POC passed</span>
              </div>
              <div className="live-card-next">
                <span className="next-label">NEXT</span>
                <strong>Full end-to-end POC</strong>
                <p>Starts next week, momentum, not just status.</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Problem, Solution, SocialProof, UseCases, LiveResults });
