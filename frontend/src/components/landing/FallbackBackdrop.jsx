/**
 * Lightweight CSS/2D substitute for the 3D scene — used when WebGL isn't
 * available (or reduced motion is requested at the OS level combined with
 * a low powered device). Keeps the same dark cinematic + red-route feel
 * without touching the GPU.
 */
export default function FallbackBackdrop({ reducedMotion = false }) {
  return (
    <div className="fallback-backdrop" aria-hidden="true">
      <div className="fallback-glow fallback-glow-a" />
      <div className="fallback-glow fallback-glow-b" />
      <svg className="fallback-route" viewBox="0 0 1200 1600" preserveAspectRatio="none">
        <path
          d="M 900 80 C 700 320, 500 480, 620 760 C 720 1000, 380 1180, 500 1520"
          className={reducedMotion ? "" : "fallback-route-path"}
        />
      </svg>
    </div>
  );
}
