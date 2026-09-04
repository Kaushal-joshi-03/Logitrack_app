import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * ScrollTruckAnimation
 *
 * Silky-smooth 60fps scroll-driven truck animation across the 5 landing sections
 * (Services, Solutions, Network, Tracking, Support).
 *
 * Optimization & Performance:
 *   - Direct GPU hardware-accelerated transform: translate3d(x, 0, 0).
 *   - Zero layout recalculations or setState calls during scroll.
 *   - Framer Motion useSpring to eliminate mouse wheel notch jitter.
 *   - Road dash stream and wheel spinning keyframes for authentic motion.
 *   - Strict containment and overflow clipping to prevent layout blowout.
 *   - Full support for mobile, tablet, desktop, and prefers-reduced-motion.
 */
export default function ScrollTruckAnimation({ wrapperRef, reducedMotion = false }) {
  const [screenWidth, setScreenWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    let rafId = null;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScreenWidth(window.innerWidth);
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end end"],
  });

  // Calculate truck travel bounds based on viewport width
  // Mobile (<640px): 130px width | Tablet (<1024px): 155px width | Desktop: 180px width
  const truckWidth = screenWidth >= 1024 ? 180 : screenWidth >= 640 ? 155 : 130;
  const startX = -(truckWidth + 30); // Cleanly off-screen left
  const endX = screenWidth + 35;     // Cleanly off-screen right

  // Smooth linear motion path spanning across all 5 sections
  const rawX = useTransform(scrollYProgress, (p) => {
    if (reducedMotion) return 100;
    const enterTarget = 0.01;
    const exitTarget = 0.94;
    const normalized = Math.min(1, Math.max(0, (p - enterTarget) / (exitTarget - enterTarget)));
    return startX + normalized * (endX - startX);
  });

  // Spring smoothing to eliminate mousewheel notch jitter and create a smooth 60fps glide
  const smoothX = useSpring(rawX, {
    stiffness: 140,
    damping: 28,
    mass: 0.15,
  });

  const x = reducedMotion ? rawX : smoothX;

  // Smooth fade in as Services scrolls into view, solid throughout the drive,
  // and fades out gracefully right before the footer
  const opacity = useTransform(scrollYProgress, (p) => {
    if (reducedMotion) return 0;
    if (p <= 0.01) return 0;
    if (p < 0.05) return (p - 0.01) / 0.04;     // Smooth fade in
    if (p < 0.92) return 1;                      // Solid throughout Services → Support
    if (p < 0.98) return 1 - (p - 0.92) / 0.06; // Smooth fade out before footer
    return 0;                                    // 0 before reaching footer
  });

  return (
    <motion.div
      className="scroll-truck-wrapper"
      aria-hidden="true"
      style={{
        opacity,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* ── Road stripe with animated dashed center line ── */}
      <div className="scroll-truck-road">
        <div className="scroll-truck-road-dash" />
      </div>

      {/* ── Hardware-accelerated truck unit ── */}
      <motion.div
        className="scroll-truck-unit"
        style={{
          x,
          willChange: "transform",
        }}
        transformTemplate={({ x: tx }) => `translate3d(${tx}, 0, 0)`}
      >
        <TruckSVG />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Inline-SVG truck with realistic chassis, container, cab, and rotating wheels.
   viewBox: 220 × 100 units.
───────────────────────────────────────────────────────────────────────────── */
function TruckSVG() {
  return (
    <svg
      className="scroll-truck-svg"
      viewBox="0 0 220 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ground shadow */}
      <ellipse cx="110" cy="97" rx="92" ry="4" fill="rgba(0,0,0,0.18)" />

      {/* ── Truck body with suspension bounce ── */}
      <g className="scroll-truck-body">
        {/* ════ CARGO BOX — grounded on bed ════ */}
        <rect x="16" y="26" width="116" height="52" rx="4" fill="#c97d3c" />
        <rect x="16" y="26" width="116" height="10" rx="4" fill="#d98d4c" />
        <rect x="68" y="26" width="6" height="52" fill="#a06428" opacity="0.55" />
        <rect x="16" y="50" width="116" height="5" fill="#a06428" opacity="0.55" />
        <rect x="26" y="60" width="76" height="14" rx="3" fill="white" opacity="0.92" />
        <text
          x="64"
          y="70.5"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
          fill="#c0421c"
          letterSpacing="0.6"
        >
          LOGITRACK
        </text>

        {/* ════ TRUCK BED / CHASSIS ════ */}
        <rect x="6" y="76" width="148" height="12" rx="2" fill="#1e293b" />
        <rect x="6" y="72" width="148" height="5" rx="2" fill="#334155" />

        {/* ════ CAB ════ */}
        <rect x="154" y="36" width="60" height="52" rx="6" fill="#1e293b" />
        <path d="M154 56 Q154 36 173 36 H202 Q214 36 214 48 V56 Z" fill="#0f172a" />
        <rect x="160" y="43" width="40" height="22" rx="3" fill="#38bdf8" opacity="0.45" />
        <line x1="162" y1="45" x2="170" y2="63" stroke="white" strokeWidth="1.5" opacity="0.35" />
        <rect x="160" y="69" width="22" height="10" rx="2" fill="#38bdf8" opacity="0.28" />
        <rect x="154" y="73" width="60" height="4" fill="#ff2438" opacity="0.95" />
        <rect x="208" y="54" width="7" height="6" rx="2" fill="#fde68a" />
        <ellipse cx="215" cy="57" rx="4" ry="3.5" fill="#fde68a" opacity="0.5" />
        <rect x="211" y="43" width="6" height="5" rx="1" fill="#334155" />
      </g>

      {/* ════ WHEELS with animated rotating rims ════ */}
      <g className="scroll-truck-wheel" style={{ transformOrigin: "42px 90px" }}>
        <circle cx="42" cy="90" r="9.5" fill="#0f172a" />
        <circle cx="42" cy="90" r="5.5" fill="#334155" />
        <circle cx="42" cy="90" r="2.5" fill="#94a3b8" />
        <line x1="42" y1="83" x2="42" y2="97" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
        <line x1="35" y1="90" x2="49" y2="90" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
      </g>
      <g className="scroll-truck-wheel" style={{ transformOrigin: "86px 90px" }}>
        <circle cx="86" cy="90" r="9.5" fill="#0f172a" />
        <circle cx="86" cy="90" r="5.5" fill="#334155" />
        <circle cx="86" cy="90" r="2.5" fill="#94a3b8" />
        <line x1="86" y1="83" x2="86" y2="97" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
        <line x1="79" y1="90" x2="93" y2="90" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
      </g>
      <g className="scroll-truck-wheel" style={{ transformOrigin: "180px 90px" }}>
        <circle cx="180" cy="90" r="9.5" fill="#0f172a" />
        <circle cx="180" cy="90" r="5.5" fill="#334155" />
        <circle cx="180" cy="90" r="2.5" fill="#94a3b8" />
        <line x1="180" y1="83" x2="180" y2="97" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
        <line x1="173" y1="90" x2="187" y2="90" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}
