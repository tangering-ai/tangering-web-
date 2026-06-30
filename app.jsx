// Main app

function App() {
  const [lang, setLang] = useState(() => {
    // Always default to English on a fresh load. Honour ?lang= only when
    // explicitly present in the URL so language choice survives a single
    // navigation but not persistent sessions.
    const url = new URLSearchParams(location.search).get("lang");
    if (url === "es" || url === "en") return url;
    try { localStorage.removeItem("tang_lang"); } catch(e) {}
    return "en";
  });
  const t = window.I18N[lang];

  // Inject Overused Grotesk (Fontshare) once
  useEffect(() => {
    if (document.getElementById("og-font")) return;
    const link = document.createElement("link");
    link.id = "og-font";
    link.rel = "stylesheet";
    link.href = "https://api.fontshare.com/v2/css?f[]=overused-grotesk@400,500,600,700&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <ParallaxBoot />
      <Nav lang={lang} setLang={setLang} t={t} />
      <Hero t={t} />
      <Problem t={t} />
      <Solution t={t} />
      <SocialProof t={t} />
      <UseCases t={t} />
      <Differentiator t={t} />
      <HowItWorks t={t} />
      <FlowBuilder t={t} />
      <VoiceTech t={t} />
      <Security t={t} />
      <FinalCTA t={t} />
      <Footer t={t} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
