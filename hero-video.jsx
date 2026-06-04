// HeroVideo — real footage background
const { useRef: useRefHV } = React;

function HeroVideo({ t, scrollY = 0 }) {
  const bgRef = useRefHV(null);

  const bgShift = scrollY * 0.18;

  return (
    <div className="vhero-media">
      <div className="vhero-bg" style={{ transform: `translateY(${bgShift}px) scale(1.08)` }}>
        <video ref={bgRef} src="assets/video-a.mp4" autoPlay muted loop playsInline></video>
      </div>
      <div className="vhero-overlay"></div>
      <div className="vhero-grain"></div>
    </div>
  );
}

window.HeroVideo = HeroVideo;
