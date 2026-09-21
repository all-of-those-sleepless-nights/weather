import type { ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { cn } from "cn";

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
  swapKey: string;
  variant?: IconSwapVariant;
  className?: string;
  children: ReactNode;
};

export function IconSwap({
  swapKey,
  variant = "spin",
  className,
  children,
}: IconSwapProps) {
  const prefersReducedMotion = useReducedMotion();
  const box = cn("pointer-events-none grid place-items-center", className);

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
