import type { ReactNode } from "react";
import type { WeatherSnapshot } from "../model/types";
import { WeatherIcon } from "./weather-icon";

type WeatherCardProps = {
  /** Drives the overlapping illustration; the default stands in without one. */
  snapshot?: WeatherSnapshot;
  children: ReactNode;
};

/**
 * The outer glass card.
 *
 * It owns the frosted material for the whole composition — the history panel
 * and rows nested inside deliberately do not blur again, since stacked
 * backdrop filters compound and cost an extra composited layer each.
 *
 * The card takes the height the page has left and lays its children out as a
 * column, so the reading sits at a fixed size and the history panel takes
 * what remains. That is what keeps the card the same height whether it is
 * showing a reading, a prompt or an error.
 */
export function WeatherCard({ snapshot, children }: WeatherCardProps) {
  return (
    // Headroom for the illustration, which overlaps the card in every state.
    <div className="relative flex min-h-0 w-full flex-1 flex-col pt-14 sm:pt-20">
      <WeatherIcon
        iconCode={snapshot?.iconCode}
        description={snapshot?.description}
        className="pointer-events-none absolute right-0 top-0 z-10 w-32 drop-shadow-2xl sm:right-8 sm:w-52 lg:w-60"
      />

      <div className="glass relative flex min-h-0 flex-1 flex-col rounded-card border border-glass-border bg-surface-card px-4 pb-4 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
        {children}
      </div>
    </div>
  );
}
