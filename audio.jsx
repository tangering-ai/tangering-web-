// Audio samples, Final CTA, Footer

const AUDIO_URLS = {
  c1: "https://media.vocaroo.com/mp3/1kEa2KjGICxl",
  c2: "https://media.vocaroo.com/mp3/1cXQ8jaFG7Ul",
  c3: "https://media.vocaroo.com/mp3/1lNYnbdEN0Bq",
  c4: "https://media.vocaroo.com/mp3/1nOax4WOKAMu",
};

function AudioCard({ idx, cls, lang, title, sub, url }) {
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCur(a.currentTime);
    const onMeta = () => setDur(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    // Pause any other playing audio in the page
    document.querySelectorAll("audio[data-tg]").forEach((a) => {
      if (a !== audioRef.current) a.pause();
    });
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`audio-card ${cls} ${playing ? "playing" : ""}`}>
      <span className="lang-pill">
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }}></span>
        {lang}
      </span>
      <div>
        <div className="title">{title}</div>
        <div className="sub">{sub}</div>
      </div>
      <div className="audio-player">
        <button className="audio-play" onClick={toggle} aria-label="play">
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="2" width="3" height="10" rx="1" />
              <rect x="9" y="2" width="3" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 1.5 L12 7 L3 12.5 Z" />
            </svg>
          )}
        </button>
        <div className="audio-bars">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              style={{
                height: `${20 + Math.abs(Math.sin(i * 1.2)) * 70}%`,
              }}
            ></span>
          ))}
        </div>
        <span className="audio-time">{fmt(cur)} / {fmt(dur)}</span>
      </div>
      <audio ref={audioRef} src={url} preload="none" data-tg></audio>
    </div>
  );
}

function AudioSamples({ t }) {
  return (
    <section className="audio" data-screen-label="09 Audio samples">
      <div className="container">
        <FadeUp className="audio-head">
          <div className="eyebrow">
            <span className="pulse"></span>
            {t.audio.eyebrow}
          </div>
          <h2>{t.audio.h2}</h2>
          <p className="lead">{t.audio.sub}</p>
        </FadeUp>

        <div className="audio-grid">
          <FadeUp delay={0}>
            <AudioCard idx={0} cls="c1" lang="ES" title={t.audio.c1t} sub={t.audio.c1s} url={AUDIO_URLS.c1} />
          </FadeUp>
          <FadeUp delay={100}>
            <AudioCard idx={1} cls="c2" lang="EN" title={t.audio.c2t} sub={t.audio.c2s} url={AUDIO_URLS.c2} />
          </FadeUp>
          <FadeUp delay={200}>
            <AudioCard idx={2} cls="c3" lang="ES" title={t.audio.c3t} sub={t.audio.c3s} url={AUDIO_URLS.c3} />
          </FadeUp>
          <FadeUp delay={300}>
            <AudioCard idx={3} cls="c4" lang="EN" title={t.audio.c4t} sub={t.audio.c4s} url={AUDIO_URLS.c4} />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ t }) {
  return (
    <section className="sub-banner" data-screen-label="10 Final CTA">
      <div className="sub-banner-blob sub-banner-blob-a"></div>
      <div className="sub-banner-blob sub-banner-blob-b"></div>
      <div className="sub-banner-blob sub-banner-blob-c"></div>
      <div className="sub-banner-blob sub-banner-blob-d"></div>
      <div className="sub-banner-inner">
        <div className="sub-banner-content">
          <span className="sub-banner-eyebrow"><span className="sub-banner-dot"></span> {t.cta.eyebrow}</span>
          <h2 className="sub-banner-headline">
            <span className="sub-banner-line">{t.cta.h2a}</span>
            <span className="sub-banner-line"><em>{t.cta.h2b}</em></span>
          </h2>
          <div className="sub-banner-bottom">
            <div className="sub-banner-actions">
              <a href="https://calendar.app.google/rSZM4ebTrNXp7bzk9" target="_blank" rel="noopener" className="sub-banner-primary">
                {t.cta.b1}
                <span className="material-icons">arrow_forward</span>
              </a>
              <a href="#cases" className="sub-banner-secondary">
                {t.cta.b2}
                <span className="material-icons">arrow_outward</span>
              </a>
            </div>
            <p className="sub-banner-sub">{t.cta.sub}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="foot" id="footer" data-screen-label="11 Footer">
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">
              <img src="assets/logo-tangering.png" alt="Tangering" className="foot-logo-img" />
            </div>
            <p className="foot-desc">{t.foot.desc}</p>
          </div>
          <div>
            <h4>{t.foot.h1}</h4>
            <ul>
              <li><a href="#cases">{t.foot.l1}</a></li>
              <li><a href="#flow">{t.foot.l2}</a></li>
              <li><a href="#diff">{t.foot.l3}</a></li>
              <li><a href="#diff">{t.foot.l4}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t.foot.h2}</h4>
            <ul>
              <li><a href="mailto:hello@tangering.ai">{t.foot.l5}</a></li>
              <li><a href="https://www.linkedin.com/company/tangering/" target="_blank" rel="noopener">{t.foot.l6}</a></li>
              <li><a href="https://calendar.app.google/rSZM4ebTrNXp7bzk9" target="_blank" rel="noopener">{t.foot.l7}</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{t.foot.copy}</span>
          <span>{t.foot.built}</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { AudioSamples, FinalCTA, Footer });
