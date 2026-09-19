import type { ReactNode } from "react";
import { AnimatePresence, m, useIsPresent, useReducedMotion } from "motion/react";
import { cn } from "cn";

type ValueSwapProps = {
  /** Changing this is what triggers the cross-fade; usually the value itself. */
  swapKey: string;
  className?: string;
  children: ReactNode;
};

/**
 * Cross-fades a piece of text when it changes.
 *
 * Both readings occupy one grid cell, so the box is exactly as tall as a
 * single line throughout — a new search updates the numbers in place instead
 * of collapsing and re-expanding the card around them.
 */
export function ValueSwap({ swapKey, className, children }: ValueSwapProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={cn("grid", className)}>
      <AnimatePresence initial={false}>
        <Layer key={swapKey}>{children}</Layer>
      </AnimatePresence>
    </span>
  );
}

/**
 * One reading, mid-flight.
 *
 * The outgoing copy lingers for the length of the transition, and these values
 * sit inside an `aria-live` region — so it hides itself from the accessibility
 * tree on the way out, leaving exactly one reading to announce.
 */
function Layer({ children }: { children: ReactNode }) {
  const isPresent = useIsPresent();

  return (
    <m.span
      initial={{ opacity: 0, y: "45%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-45%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      aria-hidden={isPresent ? undefined : true}
      className="col-start-1 row-start-1"
    >
      {children}
    </m.span>
  );
}
