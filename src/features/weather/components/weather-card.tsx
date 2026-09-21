import type { ReactNode } from "react";
import type { WeatherSnapshot } from "../model/types";
import { WeatherIcon } from "./weather-icon";

type WeatherCardProps = {
  snapshot?: WeatherSnapshot;
  hasError?: boolean;
  children: ReactNode;
};

export function WeatherCard({
  snapshot,
  hasError = false,
  children,
}: WeatherCardProps) {
  return (
    <div className="relative w-full pt-36 md:pt-20">
      <WeatherIcon
        iconCode={snapshot?.iconCode}
        description={snapshot?.description}
        isError={hasError}
        className="pointer-events-none absolute z-10 drop-shadow-2xl top-16 right-2 narrow:left-0 narrow:-right-5 narrow:mx-auto md:-top-5 md:right-4"
      />

      <div className="@container glass relative rounded-card border border-glass-border bg-surface-card px-5 py-6 narrow:pt-20 md:px-8 md:py-8">
        {children}
      </div>
    </div>
  );
}
