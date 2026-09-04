import React from "react";

/**
 * HeroBubbles — Animated floating bubble / orb background.
 *
 * Architecture (z-layers inside the hero section):
 *   z-0  : hero-bg-grid (grid pattern, already in LandingPage.jsx)
 *   z-1  : HeroBubbles (this component)
 *            ├─ .bubble-layer  (z:0) — the 18 individual floating orbs
 *            └─ .bubble-glass  (z:1) — backdrop-filter blur overlay
 *   z-10 : Hero text / cards / buttons (already in LandingPage.jsx)
 *
 * Each orb has:
 *   - radial-gradient fill (orange or charcoal)
 *   - per-element filter: blur(12px–28px)   → soft 3-D luminous look
 *   - CSS @keyframes float animation        → organic drift
 *
 * The .bubble-glass layer (backdrop-filter: blur 65px) then smears all
 * orbs together into the diffuse glowing-mesh seen in the reference.
 */

/* 18 bubble definitions — positions, sizes, colors, blur, animation */
const BUBBLES = [
  /* ── LARGE ORANGE ─────────────────────────────────────────── */
  { id: 1,  w: 200, top:  "-8%", left: "-6%",  color: "rgba(234,88,12,0.80)",   blur: 22, anim: "bubble-drift-a", dur: "14s", delay: "-2s"  },
  { id: 2,  w: 220, top:  "-12%",right: "-5%", color: "rgba(249,115,22,0.75)",  blur: 26, anim: "bubble-drift-b", dur: "16s", delay: "-6s"  },
  { id: 3,  w: 180, top:  "55%", left: "-4%",  color: "rgba(234,88,12,0.78)",   blur: 20, anim: "bubble-drift-c", dur: "13s", delay: "-4s"  },
  { id: 4,  w: 200, top:  "60%", right:"-8%",  color: "rgba(249,115,22,0.72)",  blur: 24, anim: "bubble-drift-d", dur: "15s", delay: "-9s"  },
  { id: 5,  w: 160, top:  "20%", left: "38%",  color: "rgba(234,88,12,0.68)",   blur: 18, anim: "bubble-drift-a", dur: "11s", delay: "-1s"  },

  /* ── LARGE CHARCOAL ────────────────────────────────────────── */
  { id: 6,  w: 190, top:  "8%",  left: "12%",  color: "rgba(15,23,42,0.75)",    blur: 24, anim: "bubble-drift-b", dur: "17s", delay: "-7s"  },
  { id: 7,  w: 210, top:  "45%", right:"2%",   color: "rgba(30,41,59,0.70)",    blur: 28, anim: "bubble-drift-c", dur: "14s", delay: "-3s"  },
  { id: 8,  w: 170, top:  "68%", left: "25%",  color: "rgba(15,23,42,0.72)",    blur: 22, anim: "bubble-drift-d", dur: "12s", delay: "-8s"  },
  { id: 9,  w: 185, top:  "5%",  right:"22%",  color: "rgba(30,41,59,0.68)",    blur: 26, anim: "bubble-drift-a", dur: "15s", delay: "-5s"  },

  /* ── MEDIUM ORANGE ─────────────────────────────────────────── */
  { id: 10, w: 95,  top:  "35%", left: "5%",   color: "rgba(249,115,22,0.80)",  blur: 16, anim: "bubble-drift-c", dur: "10s", delay: "-2s"  },
  { id: 11, w: 80,  top:  "15%", right:"12%",  color: "rgba(234,88,12,0.76)",   blur: 14, anim: "bubble-drift-b", dur: "9s",  delay: "-6s"  },
  { id: 12, w: 100, top:  "75%", right:"20%",  color: "rgba(249,115,22,0.74)",  blur: 18, anim: "bubble-drift-d", dur: "12s", delay: "-4s"  },
  { id: 13, w: 70,  top:  "50%", left: "55%",  color: "rgba(234,88,12,0.70)",   blur: 14, anim: "bubble-drift-a", dur: "8s",  delay: "-3s"  },

  /* ── MEDIUM CHARCOAL ───────────────────────────────────────── */
  { id: 14, w: 90,  top:  "28%", right:"35%",  color: "rgba(15,23,42,0.72)",    blur: 16, anim: "bubble-drift-b", dur: "11s", delay: "-7s"  },
  { id: 15, w: 75,  top:  "80%", left: "10%",  color: "rgba(30,41,59,0.68)",    blur: 14, anim: "bubble-drift-c", dur: "10s", delay: "-1s"  },
  { id: 16, w: 85,  top:  "42%", right:"48%",  color: "rgba(15,23,42,0.65)",    blur: 16, anim: "bubble-drift-d", dur: "13s", delay: "-9s"  },

  /* ── SMALL ACCENT ──────────────────────────────────────────── */
  { id: 17, w: 42,  top:  "85%", right:"42%",  color: "rgba(249,115,22,0.85)",  blur: 10, anim: "bubble-drift-a", dur: "7s",  delay: "-2s"  },
  { id: 18, w: 35,  top:  "22%", left: "70%",  color: "rgba(30,41,59,0.75)",    blur: 8,  anim: "bubble-drift-c", dur: "8s",  delay: "-5s"  },
];

export default function HeroBubbles() {
  return (
    /* Root: absolute, fills hero, clips overflowing orbs */
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── LAYER 0: individual floating orbs ─────────────────── */}
      <div className="bubble-layer absolute inset-0">
        {BUBBLES.map((b) => (
          <div
            key={b.id}
            className="bubble-orb absolute rounded-full"
            style={{
              width:  b.w,
              height: b.w,
              top:    b.top,
              left:   b.left  ?? undefined,
              right:  b.right ?? undefined,
              background: `radial-gradient(circle at 35% 35%, ${b.color}, transparent 70%)`,
              filter: `blur(${b.blur}px)`,
              animation: `${b.anim} ${b.dur} ease-in-out infinite`,
              animationDelay: b.delay,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* ── LAYER 1: glass diffusion overlay ──────────────────── */}
      {/*   Sits above orbs, below hero content (z-10).            */}
      {/*   backdrop-filter smears the orbs into a glowing mesh.   */}
      <div className="bubble-glass absolute inset-0" />
    </div>
  );
}
