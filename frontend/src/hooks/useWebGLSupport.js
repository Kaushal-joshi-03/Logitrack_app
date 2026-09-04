import { useEffect, useState } from "react";

function detectWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Detects WebGL availability and a rough "is this a lower powered / small
 * screen device" signal, so the 3D scene can gracefully fall back to a
 * CSS/2D animated background instead of crashing or tanking FPS.
 */
export default function useWebGLSupport() {
  const [supported, setSupported] = useState(() => detectWebGL());
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    setSupported(detectWebGL());
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { webglSupported: supported, isMobile };
}
