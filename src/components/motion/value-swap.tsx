import type { ReactNode } from "react";
import { AnimatePresence, m, useIsPresent, useReducedMotion } from "motion/react";
import { cn } from "cn";

type ValueSwapProps = {
  swapKey: string;
  className?: string;
  children: ReactNode;
};

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
