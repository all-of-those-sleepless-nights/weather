import type { ReactNode } from "react";
import type { WeatherSnapshot } from "../model/types";
import { WeatherIcon } from "./weather-icon";

type WeatherCardProps = {
  /** Drives the overlapping illustration; a glyph stands in without one. */
  snapshot?: WeatherSnapshot;
  /** Switches that glyph to the failure one. */
  hasError?: boolean;
  children: ReactNode;
};

/**
 * The outer glass card.
 *
 * It owns the frosted material for the whole composition — the history panel
 * and rows nested inside deliberately do not blur again, since stacked
 * backdrop filters compound and cost an extra composited layer each.
 */
export function WeatherCard({
  snapshot,
  hasError = false,
  children,
}: WeatherCardProps) {
  return (
    // Headroom for the illustration, which overlaps the card in every state.
    <div className="relative w-full pt-14 sm:pt-20">
      <WeatherIcon
        iconCode={snapshot?.iconCode}
        description={snapshot?.description}
        isError={hasError}
        className="pointer-events-none absolute right-0 top-0 z-10 drop-shadow-2xl sm:right-8"
      />

      <div className="glass relative rounded-card border border-glass-border bg-surface-card px-4 pb-4 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
        {children}
      </div>
    </div>
  );
}
