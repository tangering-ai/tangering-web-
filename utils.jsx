// Shared hooks and helpers
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Hook to detect when an element enters the viewport
function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    // Snapshot the current bounding rect — if the element is ALREADY in view on
    // first render (common for above-the-fold content), flip inView synchronously
    // so it can transition normally.
    const rect = ref.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      requestAnimationFrame(() => setInView(true));
      if (opts.once !== false) return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (opts.once !== false) obs.disconnect();
        } else if (opts.once === false) {
          setInView(false);
        }
      },
      { threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin ?? "0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// Word-by-word reveal
function WordReveal({ children, className = "", as: As = "span", delay = 0, style = {} }) {
  const words = String(children).split(" ");
  return (
    <As className={`word-reveal in ${className}`} style={style}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span
            className="w"
            style={{ animationDelay: `${delay + i * 60}ms` }}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </As>
  );
}

// Count-up number animation
function CountUp({ to, suffix = "", prefix = "", duration = 1400 }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [val, setVal] = useState(0);

  // Support ranges like "8-15"
  const isRange = typeof to === "string" && to.includes("-");
  const numeric = isRange ? parseFloat(to.split("-")[1]) : parseFloat(to);

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    let raf;
    const step = (t) => {
      if (!startTime) startTime = t;
      const p = Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(numeric * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  let display;
  if (isRange) {
    const lo = parseFloat(to.split("-")[0]);
    const hi = parseFloat(to.split("-")[1]);
    const cur = Math.round(val);
    const ratio = numeric === 0 ? 0 : cur / numeric;
    const loDisp = Math.round(lo * ratio);
    display = `${loDisp}-${cur}`;
  } else {
    display = Math.round(val).toString();
  }
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// Fade-up wrapper — powered by GSAP ScrollTrigger
function FadeUp({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof gsap === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 44,
        duration: 0.85,
        delay: delay / 1000,
        ease: "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: {
          trigger: el,
          start: "top 91%",
          toggleActions: "play none none reverse",
        },
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

// Hero scene rotator hook — returns active scene index 0..3
function useSceneLoop(scenes = 4, durations = [5500, 5500, 4500, 4500]) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setI((i + 1) % scenes), durations[i]);
    return () => clearTimeout(t);
  }, [i]);
  return [i, durations[i]];
}

// Global parallax — applies scrub-tied Y translation to elements
// marked with [data-parallax] (background layer, slow drift) and
// every section h2 (subtle headline drift).
function ParallaxBoot() {
  useEffect(() => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Drift every section heading slightly up as it scrolls past
      gsap.utils.toArray("section h2").forEach((h) => {
        gsap.fromTo(h,
          { y: 36 },
          {
            y: -36,
            ease: "none",
            scrollTrigger: {
              trigger: h,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });

      // Card grids: subtle staggered Y based on scroll
      gsap.utils.toArray(".uc-grid, .how4-stair, .flow3-grid, .crm-table, .proof-right").forEach((grid) => {
        const cards = grid.children;
        gsap.utils.toArray(cards).forEach((card, i) => {
          gsap.fromTo(card,
            { y: 32 + (i % 2) * 18 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: grid,
                start: "top bottom",
                end: "center center",
                scrub: 0.4,
              },
            }
          );
        });
      });

      // Decorative parallax layers
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        gsap.fromTo(el,
          { yPercent: -speed * 30 },
          {
            yPercent: speed * 30,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
}

window.useInView = useInView;
window.WordReveal = WordReveal;
window.CountUp = CountUp;
window.FadeUp = FadeUp;
window.useSceneLoop = useSceneLoop;
window.ParallaxBoot = ParallaxBoot;
