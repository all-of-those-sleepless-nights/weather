import type { ReactNode } from "react";
import type { WeatherSnapshot } from "../model/types";
import { WeatherIcon } from "./weather-icon";

type WeatherCardProps = {
  /** Drives the overlapping illustration; omitted while loading or on error. */
  snapshot?: WeatherSnapshot;
  children: ReactNode;
};

/**
 * The outer glass card.
 *
 * It owns the frosted material for the whole composition — the history panel
 * and rows nested inside deliberately do not blur again, since stacked
 * backdrop filters compound and cost an extra composited layer each.
 */
export function WeatherCard({ snapshot, children }: WeatherCardProps) {
  return (
    // Headroom is reserved only when there is an illustration to overlap it.
    <div className={`relative w-full ${snapshot ? "pt-14 sm:pt-20" : ""}`}>
      {snapshot ? (
        <WeatherIcon
          iconCode={snapshot.iconCode}
          description={snapshot.description}
          className="pointer-events-none absolute right-0 top-0 z-10 w-32 drop-shadow-2xl sm:right-8 sm:w-52 lg:w-60"
        />
      ) : null}

      <div className="glass relative rounded-card border border-glass-border bg-surface-card px-4 pb-4 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
        {children}
      </div>
    </div>
  );
}
