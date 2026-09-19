import type { ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { cn } from "cn";

/**
 * How the outgoing and incoming icons travel past each other.
 *
 * `spin` suits small glyphs that read as one control changing state — a sun
 * becoming a moon, a magnifier becoming a spinner. `lift` suits the large
 * illustration, where a rotation would be distracting at that size.
 *
 * Neither is a true morph: Framer Motion interpolates transforms and opacity,
 * not SVG path data, and the weather illustrations are raster images with no
 * geometry to interpolate at all. Overlapping the two halves of the swap is
 * what sells it as a single transformation.
 */
const SWAP_MOTION = {
  spin: {
    initial: { opacity: 0, rotate: -90, scale: 0.4 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 90, scale: 0.4 },
    transition: { duration: 0.28, ease: "easeInOut" },
  },
  lift: {
    initial: { opacity: 0, scale: 0.82, y: 14 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.82, y: -14 },
    transition: { duration: 0.42, ease: "easeInOut" },
  },
} as const;

export type IconSwapVariant = keyof typeof SWAP_MOTION;

type IconSwapProps = {
  /** Changing this is what triggers a swap; equal keys animate nothing. */
  swapKey: string;
  variant?: IconSwapVariant;
  className?: string;
  children: ReactNode;
};

/**
 * Cross-fades between two icons in place.
 *
 * Both halves of the swap occupy the same single-cell grid, so they overlap
 * without absolute positioning and the box never collapses mid-transition.
 * Under `prefers-reduced-motion` the presence wrapper is dropped entirely
 * rather than merely shortened, which also keeps exactly one child in the
 * accessibility tree for tests and screen readers.
 */
export function IconSwap({
  swapKey,
  variant = "spin",
  className,
  children,
}: IconSwapProps) {
  const prefersReducedMotion = useReducedMotion();
  const box = cn("grid place-items-center", className);

  if (prefersReducedMotion) {
    return <span className={box}>{children}</span>;
  }

  return (
    <span className={box}>
      <AnimatePresence initial={false}>
        <m.span
          key={swapKey}
          {...SWAP_MOTION[variant]}
          className="col-start-1 row-start-1 grid place-items-center"
        >
          {children}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
