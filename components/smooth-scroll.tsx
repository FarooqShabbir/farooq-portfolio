"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Inertial smooth scrolling (Lenis). Skipped for reduced motion and paused while the boot intro plays. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -72 } });
    const root = document.documentElement;
    if (root.classList.contains("booting")) lenis.stop();
    const onBooted = () => lenis.start();
    window.addEventListener("fs:booted", onBooted);
    return () => {
      window.removeEventListener("fs:booted", onBooted);
      lenis.destroy();
    };
  }, []);
  return null;
}
