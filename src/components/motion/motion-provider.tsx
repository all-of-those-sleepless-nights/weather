import type { ReactNode } from "react";
import { LazyMotion } from "motion/react";

/**
 * Loads only the animation features this app uses.
 *
 * The full `motion` component pulls in layout projection, drag and gestures —
 * roughly 40 kB gzipped that a few icon cross-fades have no use for. Pairing
 * `LazyMotion` with the `m` component and the DOM-animation feature bundle
 * imports the rest on demand instead; `strict` makes the mistake loud by
 * throwing if a component ever reaches for the eager `motion` export.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={() => import("./dom-animation").then((m) => m.default)} strict>
      {children}
    </LazyMotion>
  );
}
