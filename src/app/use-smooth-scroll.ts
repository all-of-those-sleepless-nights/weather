import { useEffect } from "react";
import Lenis from "lenis";

let activeScroll: Lenis | null = null;

/** Scrolls through Lenis when it owns the page, natively when it does not. */
export function scrollToTop() {
  if (activeScroll) {
    activeScroll.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0 });
}

export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({ lerp: 0.6, smoothWheel: true });
    activeScroll = lenis;
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      activeScroll = null;
    };
  }, []);
}
