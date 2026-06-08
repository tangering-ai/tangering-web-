// Main app

function App() {
  const [lang, setLang] = useState("en");
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
      <VoiceTech />
      <FinalCTA t={t} />
      <Footer t={t} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
