import type { ReactNode } from "react";
import { LazyMotion } from "motion/react";

/** Loads only the animation features this app uses. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={() => import("./dom-animation").then((m) => m.default)} strict>
      {children}
    </LazyMotion>
  );
}
