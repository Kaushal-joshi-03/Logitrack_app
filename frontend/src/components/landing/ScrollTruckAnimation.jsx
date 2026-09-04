import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ScrollTruckAnimation
 *
 * Silky-smooth 60fps scroll-driven truck animation powered by Framer Motion.
 *
 * Performance:
 *   - Zero React setState re-renders on scroll (no layout thrashing).
 *   - Direct GPU hardware-accelerated transform: translate3d(x, 0, 0).
 *   - will-change: transform.
 *
 * Strict Exit Timing:
 *   - Starts off-screen left (-220px) when scrolling into Services.
 *   - Completes 100% of horizontal drive across the screen by progress = 0.85
 *     (exits off-screen right >= 100vw + 50px before the footer comes into view).
 *   - Road line and truck smoothly fade out to 0 opacity before reaching the footer,
 *     ensuring zero overlap or bleed into the footer section.
 */
export default function ScrollTruckAnimation({ wrapperRef, reducedMotion = false }) {
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end end"],
  });

  // Calculate horizontal translateX directly on the GPU compositor:
  // Completes travel (exits off-screen right >= 100vw + 50px) by 85% scroll progress
  const x = useTransform(scrollYProgress, (p) => {
    if (reducedMotion) return 100;
    const exitTarget = 0.85;
    const normalized = Math.min(1, Math.max(0, p / exitTarget));
    const screenW = typeof window !== "undefined" ? window.innerWidth : 1440;
    const startX = -220; // Off-screen left
    const endX = screenW + 50; // Off-screen right
    return startX + normalized * (endX - startX);
  });

  // Smooth entry and strict exit fade out before the footer
  const opacity = useTransform(scrollYProgress, (p) => {
    if (reducedMotion) return 0;
    if (p <= 0.02) return 0;
    if (p < 0.06) return (p - 0.02) / 0.04;     // Smooth fade in
    if (p < 0.80) return 1;                      // Fully visible during drive
    if (p < 0.88) return 1 - (p - 0.80) / 0.08; // Smooth fade out before footer
    return 0;                                    // Completely invisible at footer
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
      {/* ── Road stripe ── */}
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
      >
        <TruckSVG />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Inline-SVG truck — box sits flush on the bed as one rigid unit.
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
      <ellipse cx="110" cy="97" rx="92" ry="4" fill="rgba(0,0,0,0.15)" />

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

      {/* ════ WHEELS ════ */}
      <circle cx="42" cy="90" r="9.5" fill="#0f172a" />
      <circle cx="42" cy="90" r="5.5" fill="#334155" />
      <circle cx="42" cy="90" r="2.5" fill="#94a3b8" />
      <circle cx="86" cy="90" r="9.5" fill="#0f172a" />
      <circle cx="86" cy="90" r="5.5" fill="#334155" />
      <circle cx="86" cy="90" r="2.5" fill="#94a3b8" />
      <circle cx="180" cy="90" r="9.5" fill="#0f172a" />
      <circle cx="180" cy="90" r="5.5" fill="#334155" />
      <circle cx="180" cy="90" r="2.5" fill="#94a3b8" />
    </svg>
  );
}
