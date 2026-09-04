import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LandingScrollContext = createContext(null);

/**
 * Provides scroll-spy (which landing-page section is active) and smooth
 * "scroll to section" behavior for the Navbar. Only mounted inside
 * LandingPage — every other route simply gets `null` from useLandingScroll(),
 * so Navbar falls back to its normal path-based active state there.
 */
export function LandingScrollProvider({ sectionIds, navOffset = 0, children }) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressRef = useRef(0);
  const observerRef = useRef(null);
  const ratiosRef = useRef({});

  useEffect(() => {
    ratiosRef.current = {};
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });

        let bestId = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratiosRef.current[id] || 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActiveSection(bestId);
      },
      {
        root: null,
        rootMargin: `-${navOffset}px 0px -35% 0px`,
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
      }
    );

    elements.forEach((el) => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, [sectionIds, navOffset]);

  // Overall 0..1 scroll progress across the whole landing page (used by the
  // 3D scene + the thin top progress bar).
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progressRef.current = p;
      setScrollProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToSection = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top =
        el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [navOffset]
  );

  const value = useMemo(
    () => ({ activeSection, scrollToSection, scrollProgress, progressRef }),
    [activeSection, scrollToSection, scrollProgress]
  );

  return (
    <LandingScrollContext.Provider value={value}>
      {children}
    </LandingScrollContext.Provider>
  );
}

export function useLandingScroll() {
  return useContext(LandingScrollContext);
}
