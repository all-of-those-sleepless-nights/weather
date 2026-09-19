import { useEffect } from "react";
import Lenis from "lenis";

/**
 * The page's smooth-scroll instance, or null when the user has asked for
 * reduced motion. Module scope rather than context because there is exactly
 * one document to scroll and the hook below is mounted once, at the app root.
 */
let activeScroll: Lenis | null = null;

/**
 * Scrolls the page back to the top.
 *
 * Routed through Lenis when it is running, so the animation is driven by the
 * same thing that owns the scroll position — a native smooth scroll and
 * Lenis's own loop fighting over it reads as a stutter. Without an instance
 * the native call is both correct and what reduced motion asks for.
 */
export function scrollToTop() {
  if (activeScroll) {
    activeScroll.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0 });
}

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
