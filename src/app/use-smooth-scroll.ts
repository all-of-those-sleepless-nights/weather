import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scrolling, with two things the naive setup gets wrong.
 *
 * The animation frame loop must be cancelled and the instance destroyed on
 * unmount, or React's StrictMode double-mount leaves an orphaned loop running
 * for the lifetime of the page. And a user who has asked their operating
 * system to reduce motion should not have their scrolling hijacked at all.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({ lerp: 0.6, smoothWheel: true });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
