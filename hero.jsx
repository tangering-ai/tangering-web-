// Hero v2, Cinematic frame with hyper-realistic scenes

function Nav({ lang, setLang, t }) {
  return (
    <nav className="nav">
      <a href="#" className="nav-logo">
        <img src="assets/logo-tangering.png" alt="Tangering" className="nav-logo-img" />
      </a>
      <div className="nav-links">
        <a href="product.html">{t.nav.product}</a>
        <a href="#cases">{t.nav.cases}</a>
        <a href="pricing.html">{t.nav.pricing}</a>
        <a href="about.html">{t.nav.contact}</a>
      </div>
      <div className="nav-right">
        <div className="lang-toggle">
          <button className={lang === "es" ? "active" : ""} onClick={() => setLang("es")}>ES</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
        <a
          className="btn btn-dark"
          href="https://calendar.app.google/rSZM4ebTrNXp7bzk9"
          target="_blank"
          rel="noopener"
        >
          {t.nav.demo}
        </a>
      </div>
    </nav>
  );
}

// iOS status bar with signal/wifi/battery icons
function IosStatus({ dark = false, time = "9:41" }) {
  const color = dark ? "var(--dark)" : "white";
  return (
    <div className={`ios-status ${dark ? "dark" : ""}`}>
      <span className="time">{time}</span>
      <span className="icons">
        {/* Signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={color}>
          <rect x="0" y="7" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
        </svg>
        {/* Wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill={color}>
          <path d="M7.5 0C4.7 0 2.2 1 0.3 2.7L1.7 4.2C3.2 2.8 5.3 1.9 7.5 1.9C9.7 1.9 11.8 2.8 13.3 4.2L14.7 2.7C12.8 1 10.3 0 7.5 0Z"/>
          <path d="M7.5 3.7C5.5 3.7 3.7 4.4 2.3 5.6L3.7 7C4.7 6.1 6 5.6 7.5 5.6C9 5.6 10.3 6.1 11.3 7L12.7 5.6C11.3 4.4 9.5 3.7 7.5 3.7Z"/>
          <path d="M7.5 7.4C6.3 7.4 5.3 7.9 4.6 8.7L7.5 11L10.4 8.7C9.7 7.9 8.7 7.4 7.5 7.4Z"/>
        </svg>
        {/* Battery */}
        <svg width="26" height="11" viewBox="0 0 26 11" fill="none">
          <rect x="0.5" y="0.5" width="22" height="10" rx="2.5" stroke={color} strokeOpacity="0.4" />
          <rect x="2" y="2" width="19" height="7" rx="1" fill={color} />
          <rect x="24" y="3.5" width="1.5" height="4" rx="0.5" fill={color} fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

function IosHomeIndicator({ dark = false }) {
  return (
    <div
      className="ios-home-indicator"
      style={{ background: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
    ></div>
  );
}

function Iphone({ children, statusDark = false, statusTime = "9:41", showHome = true }) {
  return (
    <div className="iphone">
      <div className="iphone-screen">
        <div className="iphone-notch"></div>
        <IosStatus dark={statusDark} time={statusTime} />
        {children}
        {showHome && <IosHomeIndicator dark={!statusDark} />}
      </div>
    </div>
  );
}

// === Scene 1, Natural chat card (no phone) ===
function SceneWhatsApp({ t, sceneActive }) {
  // All 3 messages shown simultaneously, with subtle delivered ticks animating in
  return (
    <div className="chat-card">
      <div className="chat-card-head">
        <div className="chat-avatar-ring">
          <div className="chat-avatar">
            <div className="logo-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="chat-head-info">
          <div className="chat-head-row">
            <span className="chat-name">Sarah</span>
            <span className="chat-badge">{t.hero.wa.aiBadge || "Agente IA"}</span>
          </div>
          <div className="chat-status">
            <span className="dot-online"></span>
            {t.hero.wa.online || "en línea · responde en 1.8s"}
          </div>
        </div>
        <div className="chat-channel">
          <span className="chat-channel-ic">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </span>
          WhatsApp
        </div>
      </div>

      <div className="chat-card-body">
        <div className="chat-day">{t.hero.wa.today || "HOY"} · 3:42 PM</div>

        <div className="chat-row them">
          <div className="chat-mini-avatar">
            <div className="logo-dots small">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div className="chat-bubble them">
            <span className="chat-sender">Sarah</span>
            {t.hero.wa.msg1 || "Hola María 👋 te escribo desde Envíos.com sobre tu pedido."}
            <span className="chat-meta">3:42 PM</span>
          </div>
        </div>

        <div className="chat-row them">
          <div className="chat-mini-avatar invisible"></div>
          <div className="chat-bubble them">
            {t.hero.wa.msg2 || "Tu pedido #4521 llega hoy entre 3 y 5pm. ¿Confirmamos la dirección Calle 85 #12-45?"}
            <span className="chat-meta">3:42 PM</span>
          </div>
        </div>

        <div className="chat-row me">
          <div className="chat-bubble me">
            {t.hero.wa.msg3 || "¡Sí, perfecto! Ahí estaré 🙌"}
            <span className="chat-meta">
              3:42 PM
              <span className="chat-tick">
                <svg width="14" height="9" viewBox="0 0 14 9" fill="#53bdeb">
                  <path d="M9.4 0.2 5.3 5.3 4 4.1 3.3 4.8 5.3 6.8 10.1 0.9z"/>
                  <path d="M13.4 0.2 9.3 5.3 8 4.1 7.3 4.8 9.3 6.8 14.1 0.9z"/>
                </svg>
              </span>
            </span>
          </div>
        </div>

        <div className="chat-row them">
          <div className="chat-mini-avatar invisible"></div>
          <div className="chat-bubble them subtle">
            <span className="chat-confirmed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a8c2a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {t.hero.wa.confirmed || "ENTREGA CONFIRMADA"} · #4521
            </span>
            <span className="chat-meta">3:42 PM</span>
          </div>
        </div>
      </div>

      <div className="chat-footer">
        <div className="chat-foot-stat">
          <div className="chat-foot-num">12s</div>
          <div className="chat-foot-lbl">{t.hero.wa.statTime || "respuesta total"}</div>
        </div>
        <div className="chat-foot-divider"></div>
        <div className="chat-foot-stat">
          <div className="chat-foot-num">0</div>
          <div className="chat-foot-lbl">{t.hero.wa.statHumans || "humanos involucrados"}</div>
        </div>
        <div className="chat-foot-divider"></div>
        <div className="chat-foot-stat">
          <div className="chat-foot-num">100%</div>
          <div className="chat-foot-lbl">{t.hero.wa.statAuto || "automatizado"}</div>
        </div>
      </div>
    </div>
  );
}

// === Scene 2, Realistic Tangering platform ===
function SceneDashboard({ t, sceneActive }) {
  const [lineCount, setLineCount] = useState(0);
  const [varCount, setVarCount] = useState(0);
  const [waveProgress, setWaveProgress] = useState(0);
  const [duration, setDuration] = useState(3);

  useEffect(() => {
    if (!sceneActive) {
      setLineCount(0);
      setVarCount(0);
      setWaveProgress(0);
      setDuration(3);
      return;
    }
    const timers = [
      setTimeout(() => setLineCount(1), 300),
      setTimeout(() => setVarCount(2), 600),
      setTimeout(() => setLineCount(2), 1400),
      setTimeout(() => setVarCount(4), 1900),
      setTimeout(() => setLineCount(3), 2700),
      setTimeout(() => setVarCount(6), 3300),
      setTimeout(() => setLineCount(4), 4000),
    ];
    const wt = setInterval(() => {
      setWaveProgress((p) => Math.min(100, p + 1.4));
      setDuration((d) => d + 0.12);
    }, 100);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(wt);
    };
  }, [sceneActive]);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `0m ${r}s`;
  };
  const fmtClock = (s) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  const turns = [
    { role: "ag", name: "Agente", time: "00:01", text: t.hero.dash.l1b },
    { role: "cl", name: "Cliente", time: "00:04", text: t.hero.dash.l2b },
    { role: "ag", name: "Agente", time: "00:07", text: t.hero.dash.l3b },
    { role: "ag", name: "Agente", time: "00:10", text: t.hero.dash.l4b },
  ];

  const vars = [
    { k: "source", v: "whatsapp_es" },
    { k: "direction", v: "outbound" },
    { k: "order_id", v: "4521" },
    { k: "phone_number", v: "", empty: true },
    { k: "called_number", v: "+57300123…" },
    { k: "agent_id", v: "sarah_v3" },
  ];

  const callList = [
    { name: "Customer", dur: "0m 4s", prev: "Hey there! How's it going?", active: true },
    { name: "Customer", dur: "0m 19s", prev: "I'm doing well, thanks for asking!" },
    { name: "Customer", dur: "1m 46s", prev: "No problem at all! I hope the rest…" },
    { name: "Customer", dur: "3m 33s", prev: "¡Ah, entiendo! Me despido entonces…" },
    { name: "Customer", dur: "2m 29s", prev: "¡Claro que sí! Entiendo perfecta…" },
    { name: "Pablo Banzo", dur: "0m 6s", prev: "Hola, soy Camila, agente virtual…", init: "PB", gray: true },
  ];

  // Generate stable dot waveform pattern
  const waveDots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      const r = Math.random();
      arr.push(r > 0.7 ? "bigger" : r > 0.4 ? "big" : "");
    }
    return arr;
  }, []);

  return (
    <div className="dashboard-real">
      <div className="dr-chrome">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
        <div className="url">
          <span style={{ opacity: 0.6 }}>🔒</span>
          app.tangering.ai/calls
        </div>
      </div>
      <div className="dr-body">
        {/* Left thin nav */}
        <div className="dr-nav">
          <div className="logo-mark"></div>
          <div className="ic">⌂</div>
          <div className="ic">↗</div>
          <div className="ic">▥</div>
          <div className="ic">▤</div>
          <div className="ic active">☏</div>
          <div className="ic">#</div>
          <div className="ic">
            ✉
            <span className="badge">3</span>
          </div>
          <div className="ic">📢</div>
          <div className="avatar-bot"></div>
        </div>

        {/* Calls list */}
        <div className="dr-list">
          <div className="dr-list-tabs">
            <div className="tab">
              <span className="d"></span>{t.hero.dash.tabLive || "Vivo"}
            </div>
            <div className="tab active">
              <span style={{ fontSize: 9 }}>◷</span>{t.hero.dash.tabHistory || "Historial"}
            </div>
          </div>
          <div className="dr-list-count">
            {t.hero.dash.callsCount || "5353 llamadas completadas"}
          </div>
          <div className="dr-list-scroll">
            {callList.map((c, i) => (
              <div key={i} className={`dr-list-row ${c.active ? "active" : ""}`}>
                <div className={`av ${c.gray ? "gray" : ""}`}>{c.init || "C"}</div>
                <div className="col">
                  <div className="top">
                    <span className="name">{c.name}</span>
                    <span className="dur">{c.dur}</span>
                  </div>
                  <div className="preview">{c.prev}</div>
                  <div className="status">Completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="dr-main">
          <div className="dr-top-bar">
            <div className="dr-back">‹</div>
            <div className="dr-pill live">
              {t.hero.dash.callsHistory || "Historial de llamadas"}
              <span className="grid-ic">▦</span>
            </div>
            <span className="dr-other-text">{t.hero.dash.otherCalls || "Otras llamadas"}</span>
            <div style={{ flex: 1 }}></div>
            <div className="dr-pill"><span className="arrow">‹</span>{t.hero.dash.prev || "Anterior"}</div>
            <div className="dr-pill">{t.hero.dash.next || "Siguiente"}<span className="arrow">›</span></div>
          </div>

          <div className="dr-customer">
            <div className="ava-big">C</div>
            <div className="info">
              <div className="name">Customer</div>
              <div className="meta">
                <span style={{ fontVariantNumeric: "tabular-nums" }}>187565533</span>
                <span className="sep">·</span>
                <span>{t.hero.dash.callDuration || "Duración:"} {fmtTime(duration)}</span>
                <span className="sep">·</span>
                <span style={{ fontVariantNumeric: "tabular-nums", opacity: 0.7 }}>20078F77</span>
                <span className="pill-blue"><span className="d"></span>{t.hero.dash.liveBadge || "En curso"}</span>
              </div>
            </div>
            <div className="more">⋯</div>
          </div>

          <div className="dr-audio">
            <div className="controls">
              <span className="play-ic">▷</span>
              <span className="skip-ic">⏪</span>
              <span className="skip-ic">⏩</span>
            </div>
            <span className="time">{fmtClock(duration)}</span>
            <div className="wave-dots">
              {waveDots.map((cls, i) => (
                <span
                  key={i}
                  className={`d ${cls} ${(i / waveDots.length) * 100 < waveProgress ? "played" : ""}`}
                ></span>
              ))}
            </div>
            <span className="time">0:12</span>
            <div className="speed">1x <span style={{ fontSize: 8 }}>⌄</span></div>
            <span className="head-ic">🎧</span>
          </div>

          <div className="dr-transcript-head">
            <span className="title">{t.hero.dash.transcriptTitle || "Transcripción de la llamada"}</span>
            <div className="search">
              <span>🔍</span>
              {t.hero.dash.searchPlaceholder || "Buscar palabras o frases…"}
            </div>
          </div>

          <div className="dr-transcript">
            {turns.slice(0, lineCount).map((tr, i) => (
              <div key={i} className="dr-turn">
                {tr.role === "ag" ? (
                  <div className="ava-tang"></div>
                ) : (
                  <div className="ava-cl">C</div>
                )}
                <div className="col">
                  <div className="head">
                    <span className="name">{tr.role === "ag" ? "Agente" : "Cliente"}</span>
                    <span className="time">{tr.time}</span>
                  </div>
                  <div className="bubble">
                    {tr.text}
                    {i === lineCount - 1 && i < turns.length - 1 ? (
                      <span className="cursor"></span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="dr-right">
          <div>
            <div className="dr-section-label">
              {t.hero.dash.liveState || "ESTADO EN VIVO"}
            </div>
            <div className="dr-kv">
              <span className="k">{t.hero.dash.kStatus || "Estado"}</span>
              <span className="v">
                <span className="pill-blue"><span className="d"></span>{t.hero.dash.liveBadge || "En curso"}</span>
              </span>
            </div>
            <div className="dr-kv">
              <span className="k">{t.hero.dash.kActiveAgent || "Agente activo"}</span>
              <span className="v">Sarah AI</span>
            </div>
            <div className="dr-kv">
              <span className="k">{t.hero.dash.kDurationCurrent || "Duración actual"}</span>
              <span className="v" style={{ fontVariantNumeric: "tabular-nums" }}>{fmtTime(duration)}</span>
            </div>
            <div className="dr-kv">
              <span className="k">{t.hero.dash.kTurns || "Turnos"}</span>
              <span className="v">{lineCount}</span>
            </div>
            <div className="dr-kv">
              <span className="k">{t.hero.dash.kType || "Tipo"}</span>
              <span className="v">{t.hero.dash.outbound || "Saliente"}</span>
            </div>
            <div className="dr-kv">
              <span className="k">{t.hero.dash.kStart || "Inicio"}</span>
              <span className="v" style={{ fontVariantNumeric: "tabular-nums" }}>15:42</span>
            </div>
            <div className="dr-correct-btn">
              <span className="warn">!</span>
              {t.hero.dash.requestCorrection || "Solicitar Corrección"}
            </div>
          </div>

          <div>
            <div className="dr-section-label">
              <span className="braces">{"{}"}</span>
              {t.hero.dash.contextVars || "VARIABLES DE CONTEXTO"}
              <span className="count">{varCount} {t.hero.dash.varsCount || "variables"}</span>
              <span className="chev">⌄</span>
            </div>
            <div className="dr-vars">
              {vars.slice(0, varCount).map((v, i) => (
                <div key={i} className={`dr-var ${v.empty ? "empty" : ""}`}>
                  <span className="k">{v.k}</span>
                  <span className="v">{v.v || ", "}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="dr-section-label">
              <span className="braces">{">_"}</span>
              {t.hero.dash.tools || "HERRAMIENTAS"}
              <span className="count">0</span>
              <span className="chev">⌄</span>
            </div>
            <div className="dr-tools-empty">
              {t.hero.dash.toolsEmpty || "Sin llamadas a herramientas"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Scene 3, Lock-screen push to courier ===
function SceneCourier({ t, sceneActive }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Iphone statusDark={false} showHome={true}>
        <div className="lockscreen">
          <div className="lock-time">9:41</div>
          <div className="lock-date">{t.hero.courier.date || "Martes, 18 de marzo"}</div>
          {sceneActive && (
            <div className="lock-push" key="push">
              <div className="lock-push-head">
                <div className="lock-push-app">T</div>
                <div className="lock-push-name">{t.hero.courier.appName}</div>
                <div className="lock-push-time">{t.hero.courier.time}</div>
              </div>
              <div className="lock-push-title">{t.hero.courier.title}</div>
              <div className="lock-push-body">{t.hero.courier.body}</div>
            </div>
          )}
          {sceneActive && <div className="lock-thumb">👍</div>}
        </div>
      </Iphone>
    </div>
  );
}

// === Scene 4, Outro with countdown ===
function SceneOutro({ t, sceneActive }) {
  const [n, setN] = useState(12);
  useEffect(() => {
    if (!sceneActive) {
      setN(12);
      return;
    }
    const id = setInterval(() => {
      setN((prev) => (prev > 1 ? prev - 1 : prev));
    }, 180);
    return () => clearInterval(id);
  }, [sceneActive]);

  return (
    <div className="outro">
      <div className="outro-count">
        {String(n).padStart(2, "0")}
      </div>
      <div className="outro-unit">{t.hero.outro.unit || "SEGUNDOS"}</div>
      <div className="outro-line"></div>
      <div className="outro-sub">{t.hero.outro2}</div>
    </div>
  );
}

// === Cinematic frame (scroll-driven for parallax storytelling) ===
function CinematicFrame({ t }) {
  const DUR = [9000, 9500, 5000, 4500];
  const sectionRef = useRef(null);
  const [scene, setScene] = useState(0);
  const [parallax, setParallax] = useState({ y: 0, scale: 1, depth: 0 });

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = Math.max(1, rect.height - vh);
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalScroll);
      // 4 scenes mapped across full scroll
      const sceneIdx = Math.min(3, Math.floor(progress * 4));
      setScene(sceneIdx);
      // Parallax: shift person silhouette + phone slightly
      setParallax({
        y: progress * -60,
        scale: 1 + Math.min(0.06, progress * 0.06),
        depth: progress,
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const captions = [
    t.hero.cap1 || "00:01 · El agente IA contacta al cliente vía WhatsApp",
    t.hero.cap2 || "00:05 · Live: la operación entera ve la conversación",
    t.hero.cap3 || "00:09 · El mensajero recibe la dirección verificada",
    t.hero.cap4 || "00:12 · Sin un humano. Sin errores. Sin entregas fallidas.",
  ];

  const splitCap = (c) => {
    const m = c.match(/^(\d{2}:\d{2})\s*·\s*(.+)$/);
    if (m) return [m[1], m[2]];
    return [null, c];
  };

  return (
    <section ref={sectionRef} className="cinematic-parallax">
      <div className="cinematic-sticky">
        {/* Person silhouette backdrop, placeholder for real photo */}
        <div
          className="hero-person"
          style={{
            transform: `translate(-50%, -50%) translateY(${parallax.y * 0.6}px) scale(${1 + parallax.depth * 0.08})`,
            opacity: 1 - parallax.depth * 0.5,
          }}
        >
          <div className="hero-person-head"></div>
          <div className="hero-person-body"></div>
          <div className="hero-person-arm"></div>
        </div>

        <div className="cinematic">
          <div
            className="cinematic-frame"
            style={{
              transform: `translateY(${parallax.y}px) scale(${parallax.scale})`,
            }}
          >
            <div className="cine-top">
              <div className="cine-tag">
                <span className="rec"></span>
                {t.hero.sceneTag}
              </div>
              <div className="cine-progress">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={i < scene ? "done" : i === scene ? "active" : ""}
                  ></span>
                ))}
              </div>
            </div>

            <div className="cine-stage">
              <div className={`cine-scene ${scene === 0 ? "active" : ""}`}>
                <div className="bg-cafe"></div>
                {scene === 0 && <SceneWhatsApp t={t} sceneActive={true} />}
              </div>
              <div className={`cine-scene ${scene === 1 ? "active" : ""}`}>
                <div className="bg-control"></div>
                {scene === 1 && <SceneDashboard t={t} sceneActive={true} />}
              </div>
              <div className={`cine-scene ${scene === 2 ? "active" : ""}`}>
                <div className="bg-night"></div>
                {scene === 2 && <SceneCourier t={t} sceneActive={true} />}
              </div>
              <div className={`cine-scene ${scene === 3 ? "active" : ""}`}>
                <div className="bg-black"></div>
                {scene === 3 && <SceneOutro t={t} sceneActive={true} />}
              </div>
            </div>

            <div className="cine-caption">
              {captions.map((c, i) => {
                const [ts, txt] = splitCap(c);
                return (
                  <div
                    key={i}
                    className={`txt ${scene === i ? "in" : ""}`}
                    style={{ position: "absolute" }}
                  >
                    {ts && <span className="ts">{ts}</span>}
                    {txt}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="scroll-hint" style={{ opacity: 1 - parallax.depth * 2 }}>
          <span>{t.hero.scrollHint || "Desliza para descubrir la historia"}</span>
          <div className="scroll-mouse"><span></span></div>
        </div>
      </div>
    </section>
  );
}

function Hero({ t }) {
  return (<>
    <TruckHero t={t} />
  </>);
}

function TruckHero({ t }) {
  const [scrollY, setScrollY] = useState(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Cinematic hero entrance ──────────────────────────────────
  useEffect(() => {
    if (typeof gsap === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Set everything invisible before animating
    gsap.set(".vhero-eyebrow", { opacity: 0, y: 20 });
    gsap.set(".vhero-h1 .w",   { opacity: 0, y: 48, rotationX: 12 });
    gsap.set(".vhero-sub",     { opacity: 0, y: 24 });
    gsap.set(".vhero-ctas",    { opacity: 0, y: 28 });
    gsap.set(".vhero-metrics", { opacity: 0, y: 20 });
    gsap.set(".vhero-live-inline", { opacity: 0 });
    gsap.set(".vhero-right",   { opacity: 0, x: 60 });

    const tl = gsap.timeline({ delay: 0.25 });
    tl.to(".vhero-eyebrow", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .to(".vhero-h1 .w", {
        opacity: 1, y: 0, rotationX: 0,
        duration: 0.75, ease: "power3.out",
        stagger: 0.07,
      }, "-=0.35")
      .to(".vhero-sub",  { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.45")
      .to(".vhero-ctas", { opacity: 1, y: 0, duration: 0.65, ease: "back.out(1.6)" }, "-=0.4")
      .to(".vhero-metrics", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
      .to(".vhero-live-inline", { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.3")
      .to(".vhero-right", { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }, 0.45);

    // Parallax, video drifts down as user scrolls
    gsap.to(".vhero-bg", {
      y: 120,
      ease: "none",
      scrollTrigger: {
        trigger: ".vhero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Sequential card reveal, story unfolds step by step then loops
  useEffect(() => {
    let alive = true;
    const sequence = async () => {
      while (alive) {
        for (let i = 1; i <= 4; i++) {
          if (!alive) return;
          setStep(i);
          await new Promise((r) => setTimeout(r, 1400));
        }
        // Hold all-visible for a beat, then reset
        await new Promise((r) => setTimeout(r, 3500));
        if (!alive) return;
        setStep(0);
        await new Promise((r) => setTimeout(r, 400));
      }
    };
    sequence();
    return () => { alive = false; };
  }, []);

  // Pull cards toward each other and shrink truck slightly as user scrolls
  const p = Math.min(1, scrollY / 800);

  return (
    <>
    <section className="vhero" data-screen-label="01 Hero">
      <HeroVideo t={t} scrollY={scrollY} />

      <div className="vhero-content container">
        <div className="vhero-left">
          <FadeUp>
            <div className="eyebrow vhero-eyebrow">
              <span className="pulse"></span>
              {t.hero.eyebrow}
            </div>
          </FadeUp>
          <h1 className="vhero-h1">
            <WordReveal as="span">{t.hero.h1a}</WordReveal>{" "}
            <WordReveal as="span" className="accent" delay={300}>{t.hero.h1b}</WordReveal>{" "}
            <WordReveal as="span" delay={700}>{t.hero.h1c}</WordReveal>
          </h1>
          <FadeUp delay={400}>
            <p className="lead vhero-sub">{t.hero.sub}</p>
          </FadeUp>
          <FadeUp delay={600}>
            <div className="hero-ctas vhero-ctas">
              <a className="btn btn-primary" href="#solution">
                {t.hero.cta1} <span>→</span>
              </a>
              <a
                className="btn btn-glass"
                href="https://calendar.app.google/rSZM4ebTrNXp7bzk9"
                target="_blank"
                rel="noopener"
              >
                {t.hero.cta2}
              </a>
            </div>
          </FadeUp>
          <FadeUp delay={800}>
            <div className="vhero-metrics">
              <div className="m">
                <div className="v">{t.hero.m1v}</div>
                <div className="l">{t.hero.m1}</div>
              </div>
              <div className="m-sep"></div>
              <div className="m">
                <div className="v">{t.hero.m2v}</div>
                <div className="l">{t.hero.m2}</div>
              </div>
              <div className="m-sep"></div>
              <div className="m">
                <div className="v">{t.hero.m3v}</div>
                <div className="l">{t.hero.m3}</div>
              </div>
            </div>
            <div className="vhero-live-inline">
              <span className="vhero-live-dot"></span>
              {t.hero.liveTag}
            </div>
          </FadeUp>
        </div>

        <div className="vhero-right">
          <HeroChatCard t={t} />
        </div>
      </div>
    </section>

    <section className="hero-brands">
      <div className="container">
        <div className="hero-brands-headline">
          +<span className="accent">1 Million</span> calls <span className="accent" style={{ fontStyle: "italic", fontWeight: 400 }}>for them</span>
        </div>
      </div>
      <div className="hero-brands-track">
          {[
            { n: "Visa",          src: "assets/logos/visa.png" },
            { n: "Servientrega",  src: "assets/logos/servientrega.png" },
            { n: "Blue Express",  src: "assets/logos/blue-express.png" },
            { n: "Wingo",         src: "assets/logos/wingo.png" },
            { n: "Carvajal",      src: "assets/logos/carvajal.png" },
            { n: "Amarilo",       src: "assets/logos/amarilo.png" },
            { n: "GNP BPO",       src: "assets/logos/gnp-bpo.png" },
            { n: "Interagua",     src: "assets/logos/interagua.png" },
            // duplicate set for seamless loop
            { n: "Visa2",         src: "assets/logos/visa.png" },
            { n: "Servientrega2", src: "assets/logos/servientrega.png" },
            { n: "BlueExpress2",  src: "assets/logos/blue-express.png" },
            { n: "Wingo2",        src: "assets/logos/wingo.png" },
            { n: "Carvajal2",     src: "assets/logos/carvajal.png" },
            { n: "Amarilo2",      src: "assets/logos/amarilo.png" },
            { n: "GNP2",          src: "assets/logos/gnp-bpo.png" },
            { n: "Interagua2",    src: "assets/logos/interagua.png" },
          ].map((b, i) => (
            <div key={i} className="hero-brand">
              <img src={b.src} alt={b.n} />
            </div>
          ))}
        </div>
    </section>
    </>
  );
}

// === Mini floating cards around the truck ===
function MiniChat({ t }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let i = 0;
    const seq = setInterval(() => {
      i = (i + 1) % 5;
      setPhase(i);
    }, 1400);
    return () => clearInterval(seq);
  }, []);
  return (
    <div className="m-chat">
      <div className="m-chat-head">
        <div className="m-chat-avatar">
          <div className="logo-dots small"><span></span><span></span><span></span></div>
        </div>
        <div>
          <div className="m-chat-name">Sarah <span className="m-chat-pill">AGENTE IA</span></div>
          <div className="m-chat-status">
            <span className="dot-online"></span>
            {phase === 1 ? (t.hero.wa.typing || "escribiendo…") : "WhatsApp · en línea"}
          </div>
        </div>
      </div>
      <div className="m-chat-body">
        {phase >= 2 && (
          <div className="m-bub them" key={`b1-${phase >= 2}`}>
            {t.hero.wa.msg2 || "Tu pedido #4521 llega hoy 3-5pm. ¿Confirmas la dirección?"}
          </div>
        )}
        {phase === 3 && (
          <div className="m-typing-mini">
            <span></span><span></span><span></span>
          </div>
        )}
        {phase >= 4 && (
          <div className="m-bub me" key={`b2-${phase >= 4}`}>
            {t.hero.wa.msg3 || "¡Sí, perfecto! 🙌"}
            <svg className="m-tick" width="12" height="8" viewBox="0 0 14 9" fill={phase >= 5 ? "#53bdeb" : "rgba(255,255,255,0.7)"}>
              <path d="M9.4 0.2 5.3 5.3 4 4.1 3.3 4.8 5.3 6.8 10.1 0.9z"/>
              <path d="M13.4 0.2 9.3 5.3 8 4.1 7.3 4.8 9.3 6.8 14.1 0.9z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniDash({ t }) {
  return (
    <div className="m-dash">
      <div className="m-dash-row">
        <div className="m-dash-dot"></div>
        <span className="m-dash-label">{t.hero.dash.liveBadge || "EN VIVO"}</span>
        <span className="m-dash-time">00:08</span>
      </div>
      <div className="m-dash-call">
        <div className="m-dash-ava">M</div>
        <div className="m-dash-info">
          <div className="m-dash-name">María González</div>
          <div className="m-dash-num">+57 300 123 4567</div>
        </div>
      </div>
      <div className="m-dash-waves">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 0.9)) * 70}%` }}></span>
        ))}
      </div>
      <div className="m-dash-trans">
        <div className="m-dash-line">
          <span className="m-dash-who">Agente</span>
          <span>Su pedido #4521 llega hoy entre 3 y 5pm…</span>
        </div>
      </div>
    </div>
  );
}

function MiniChat2({ t }) {
  return (
    <div className="m-chat">
      <div className="m-chat-head">
        <div className="m-chat-avatar">
          <div className="logo-dots small"><span></span><span></span><span></span></div>
        </div>
        <div>
          <div className="m-chat-name">Diego <span className="m-chat-pill">{t.hero.wa.aiBadge || "AGENTE IA"}</span></div>
          <div className="m-chat-status"><span className="dot-online"></span>WhatsApp · {t.hero.wa.status || "en línea"}</div>
        </div>
      </div>
      <div className="m-chat-body">
        <div className="m-bub them">{t.hero.wa.msg4 || "¡Hola Camila! Te confirmo que tu pedido llegó a la zona. ¿Prefieres que pase ahora o en 30 min?"}</div>
        <div className="m-bub me">
          {t.hero.wa.msg5 || "En 30 min porfa ✨"}
          <svg className="m-tick" width="12" height="8" viewBox="0 0 14 9" fill="#53bdeb">
            <path d="M9.4 0.2 5.3 5.3 4 4.1 3.3 4.8 5.3 6.8 10.1 0.9z"/>
            <path d="M13.4 0.2 9.3 5.3 8 4.1 7.3 4.8 9.3 6.8 14.1 0.9z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function MiniPush({ t }) {
  return (
    <div className="m-push">
      <div className="m-push-head">
        <div className="m-push-app">T</div>
        <div className="m-push-name">Tangering Mensajero</div>
        <div className="m-push-time">ahora</div>
      </div>
      <div className="m-push-title">📦 Cliente confirmado · #4521</div>
      <div className="m-push-body">Calle 85 #12-45, Bogotá · 3-5pm</div>
      <div className="m-push-action">
        <span className="m-push-check">✓</span>
        {t.hero.courier.confirmed || "Mensajero notificado"}
      </div>
    </div>
  );
}

function MiniStat({ t }) {
  return (
    <div className="m-stat">
      <div className="m-stat-label">{t.hero.statLabel || "TODO EN"}</div>
      <div className="m-stat-num">12<span className="m-stat-unit">s</span></div>
      <div className="m-stat-list">
        <div><span className="m-stat-d lime"></span>Sin humanos</div>
        <div><span className="m-stat-d lime"></span>Sin errores</div>
        <div><span className="m-stat-d lime"></span>Sin fallos</div>
      </div>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4.5"/>
      <path d="M3.5 20.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5" strokeWidth="0" fillOpacity="0.9"/>
    </svg>
  );
}

function HeroChatCard({ t }) {
  const [phase, setPhase] = useState(0);

  // phases: 0=reset, 1=cm1, 2=cm2, 3=client typing, 4=cm3(client),
  //         5=cm4(agent), 6=client typing2, 7=cm5(client), 8=confirmed
  useEffect(() => {
    let alive = true;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const run = async () => {
      setPhase(1);
      while (alive) {
        await wait(1400); if (!alive) return; setPhase(2);
        await wait(1400); if (!alive) return; setPhase(3);
        await wait(1000); if (!alive) return; setPhase(4);
        await wait(1600); if (!alive) return; setPhase(5);
        await wait(1400); if (!alive) return; setPhase(6);
        await wait(900);  if (!alive) return; setPhase(7);
        await wait(1400); if (!alive) return; setPhase(8);
        await wait(4500); if (!alive) return;
        setPhase(0);
        await wait(400);  if (!alive) return;
        setPhase(1);
      }
    };
    run();
    return () => { alive = false; };
  }, []);

  const isTyping = phase === 3 || phase === 6;

  return (
    <div className="hcc">
      <div className="hcc-agent-chip">
        <div className="hcc-av-agent">
          <img src="assets/icono-tangering.png" alt="Tangering" className="hcc-logo-img" />
        </div>
        <div className="hcc-chip-info">
          <span className="hcc-name">Sarah</span>
          <span className="hcc-pill">{t.hero.wa.aiBadge || "AI Agent"}</span>
        </div>
        <div className="hcc-chip-status">
          <span className="dot-online"></span>
          <span>{isTyping ? (t.hero.wa.typing || "typing…") : "online"}</span>
        </div>
      </div>

      <div className="hcc-bubbles">
        {phase >= 1 && (
          <div className="hcc-row" key="r1">
            <div className="hcc-av-sm agent">
              <img src="assets/icono-tangering.png" alt="" className="hcc-av-img" />
            </div>
            <div className="hcc-bubble agent">
              {t.hero.wa.cm1 || "Hi James 👋 this is Sarah, from Envios.com"}
              <span className="hcc-time">3:42</span>
            </div>
          </div>
        )}

        {phase >= 2 && (
          <div className="hcc-row" key="r2">
            <div className="hcc-av-sm invisible"></div>
            <div className="hcc-bubble agent">
              {t.hero.wa.cm2 || "Your order #4521 is scheduled for today 3–5pm. Can you confirm: 742 Elm Street?"}
              <span className="hcc-time">3:42</span>
            </div>
          </div>
        )}

        {phase === 3 && (
          <div className="hcc-row client" key="typ1">
            <div className="hcc-av-sm client"><PersonIcon /></div>
            <div className="hcc-typing"><span></span><span></span><span></span></div>
          </div>
        )}

        {phase >= 4 && (
          <div className="hcc-row client" key="r3">
            <div className="hcc-av-sm client"><PersonIcon /></div>
            <div className="hcc-bubble client">
              {t.hero.wa.cm3 || "Yes! That address is correct 👍"}
              <span className="hcc-time">
                3:43
                <svg className="hcc-tick" width="14" height="9" viewBox="0 0 14 9" fill="rgba(255,255,255,0.45)">
                  <path d="M9.4 0.2 5.3 5.3 4 4.1 3.3 4.8 5.3 6.8 10.1 0.9z"/>
                  <path d="M13.4 0.2 9.3 5.3 8 4.1 7.3 4.8 9.3 6.8 14.1 0.9z"/>
                </svg>
              </span>
            </div>
          </div>
        )}

        {phase >= 5 && (
          <div className="hcc-row" key="r4">
            <div className="hcc-av-sm invisible"></div>
            <div className="hcc-bubble agent">
              {t.hero.wa.cm4 || "Perfect! You'll get a notification 15 min before arrival 📦"}
              <span className="hcc-time">3:43</span>
            </div>
          </div>
        )}

        {phase === 6 && (
          <div className="hcc-row client" key="typ2">
            <div className="hcc-av-sm client"><PersonIcon /></div>
            <div className="hcc-typing"><span></span><span></span><span></span></div>
          </div>
        )}

        {phase >= 7 && (
          <div className="hcc-row client" key="r5">
            <div className="hcc-av-sm client"><PersonIcon /></div>
            <div className="hcc-bubble client">
              {t.hero.wa.cm5 || "Great, I'll be home. Thanks, Sarah!"}
              <span className="hcc-time">
                3:43
                <svg className="hcc-tick" width="14" height="9" viewBox="0 0 14 9" fill={phase >= 8 ? "#beef62" : "rgba(255,255,255,0.45)"}>
                  <path d="M9.4 0.2 5.3 5.3 4 4.1 3.3 4.8 5.3 6.8 10.1 0.9z"/>
                  <path d="M13.4 0.2 9.3 5.3 8 4.1 7.3 4.8 9.3 6.8 14.1 0.9z"/>
                </svg>
              </span>
            </div>
          </div>
        )}

        {phase >= 8 && (
          <div className="hcc-confirmed" key="cf">
            <span className="hcc-confirmed-check">✓</span>
            {t.hero.wa.confirmed || "DELIVERY CONFIRMED"} · #4521
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Nav, Hero });
