import { useEffect, useRef } from "react";

/**
 * HeroPinballBubbles — Shiprocket-style large, soft floating ambient orbs.
 *
 * Requirements:
 *   1. Significantly bigger bubbles (22 total):
 *      - Small: 50px – 80px
 *      - Medium: 90px – 140px
 *      - Large: 160px – 240px
 *   2. Soft, balanced glow edges (blur 48px, within the 40–55px range).
 *   3. Natural floating motion: continuous bouncing velocity + organic sine sway/drift.
 *   4. 70% deep vibrant orange + 30% deep charcoal/black spheres.
 */

/* ─────────────── Palette ───────────────────────────────── */
const ORANGE = [
  { r: 234, g: 88, b: 12, a: 0.75 }, // rgba(234, 88, 12, 0.75) deep vibrant orange
  { r: 249, g: 115, b: 22, a: 0.70 }, // rgba(249, 115, 22, 0.70) vibrant orange
  { r: 255, g: 120, b: 0, a: 0.72 }, // #ff7800 electric warm orange
];

const CHARCOAL = [
  { r: 15, g: 23, b: 42, a: 0.65 }, // rgba(15, 23, 42, 0.65) dark charcoal
  { r: 30, g: 41, b: 59, a: 0.70 }, // rgba(30, 41, 59, 0.70) deep slate
];

const TOTAL = 52; // Raised to 45–60 range for richer, continuous screen-wide density
const BLUR_PX = 48; // 40–55px range creates soft, 3D luminous glowing spheres
const BLUR_PAD = 100;

/* ─────────────── Factory ───────────────────────────────── */
function makeBubble(W, H) {
  const isOrange = Math.random() < 0.70; // 70% orange, 30% charcoal
  const pal = isOrange ? ORANGE : CHARCOAL;
  const col = pal[Math.floor(Math.random() * pal.length)];

  // Balanced density: 40% small (35–65px), 45% medium (70–120px), 15% large (140–210px)
  const sizeRand = Math.random();
  let radius;
  if (sizeRand < 0.40) {
    radius = 35 + Math.random() * 30;  // 35px – 65px
  } else if (sizeRand < 0.85) {
    radius = 70 + Math.random() * 50;  // 70px – 120px
  } else {
    radius = 140 + Math.random() * 70; // 140px – 210px
  }

  // Continuous floating velocity
  const speed = 0.9 + Math.random() * 0.8;
  const angle = Math.random() * Math.PI * 2;

  // Organic sway parameters for curved, floaty ambient motion
  const phase = Math.random() * Math.PI * 2;
  const swaySpeed = 0.015 + Math.random() * 0.015;
  const swayAmp = 0.35 + Math.random() * 0.35;

  return {
    x: radius + Math.random() * Math.max(1, W - radius * 2),
    y: radius + Math.random() * Math.max(1, H - radius * 2),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
    col,
    opacity: col.a,
    phase,
    swaySpeed,
    swayAmp,
  };
}

/* ─────────────── Draw discrete orb ─────────────────────── */
function drawOrb(ctx, b) {
  const { r, g, b: blue } = b.col;
  const a = b.opacity;

  // Soft spherical highlight offset
  const hx = b.x - b.radius * 0.22;
  const hy = b.y - b.radius * 0.22;

  const grad = ctx.createRadialGradient(
    hx, hy, b.radius * 0.06,
    b.x, b.y, b.radius
  );

  // Luminous spherical core with smooth outward transition
  grad.addColorStop(0.00, `rgba(${r},${g},${blue},${a.toFixed(3)})`);
  grad.addColorStop(0.40, `rgba(${r},${g},${blue},${(a * 0.92).toFixed(3)})`);
  grad.addColorStop(0.70, `rgba(${r},${g},${blue},${(a * 0.60).toFixed(3)})`);
  grad.addColorStop(0.90, `rgba(${r},${g},${blue},${(a * 0.20).toFixed(3)})`);
  grad.addColorStop(1.00, `rgba(${r},${g},${blue},0)`);

  ctx.beginPath();
  ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

/* ─────────────── Component ─────────────────────────────── */
export default function HeroPinballBubbles() {
  const canvasRef = useRef(null);
  const S = useRef({ bubbles: [], W: 0, H: 0, raf: null, off: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = S.current;

    const applySize = (W, H) => {
      canvas.width = W;
      canvas.height = H;
      s.W = W;
      s.H = H;

      const off = document.createElement("canvas");
      off.width = W + BLUR_PAD * 2;
      off.height = H + BLUR_PAD * 2;
      s.off = off;

      s.bubbles = Array.from({ length: TOTAL }, () => makeBubble(W, H));
    };

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 0 && height > 0) applySize(width, height);
      }
    });
    ro.observe(canvas.parentElement);

    const rect = canvas.parentElement.getBoundingClientRect();
    applySize(rect.width || window.innerWidth, rect.height || window.innerHeight);

    const tick = () => {
      const { W, H, bubbles, off } = s;
      if (!off) { s.raf = requestAnimationFrame(tick); return; }

      const offCtx = off.getContext("2d");
      offCtx.clearRect(0, 0, W + BLUR_PAD * 2, H + BLUR_PAD * 2);

      for (const b of bubbles) {
        // Organic sinusoidal sway added to continuous linear velocity
        b.phase += b.swaySpeed;
        const driftX = Math.sin(b.phase) * b.swayAmp;
        const driftY = Math.cos(b.phase * 0.8) * b.swayAmp;

        b.x += b.vx + driftX;
        b.y += b.vy + driftY;

        // Smooth bouncing off container bounds
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = Math.abs(b.vx);
        } else if (b.x + b.radius > W) {
          b.x = W - b.radius;
          b.vx = -Math.abs(b.vx);
        }

        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy = Math.abs(b.vy);
        } else if (b.y + b.radius > H) {
          b.y = H - b.radius;
          b.vy = -Math.abs(b.vy);
        }

        const ox = b.x;
        const oy = b.y;
        b.x += BLUR_PAD;
        b.y += BLUR_PAD;
        drawOrb(offCtx, b);
        b.x = ox;
        b.y = oy;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.filter = `blur(${BLUR_PX}px)`;
      ctx.drawImage(off, -BLUR_PAD, -BLUR_PAD);
      ctx.restore();

      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 block h-full w-full"
      aria-hidden="true"
    />
  );
}
