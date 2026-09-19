import {
  formatPlace,
  formatTemperature,
  formatTimestamp,
} from "@/lib/format";
import type { WeatherSnapshot } from "../model/types";

/**
 * The headline reading.
 *
 * The two mockups arrange the metadata differently — mobile as two columns,
 * desktop as one aligned row beneath the range. Rather than render both and
 * hide one, every fact appears in the DOM exactly once and is placed by
 * explicit grid coordinates per breakpoint. Duplicating the markup would
 * mean a screen reader announcing the humidity twice.
 */
export function WeatherSummary({ snapshot }: { snapshot: WeatherSnapshot }) {
  const observedAtIso = snapshot.observedAt.toISOString();
  const timestamp = formatTimestamp(
    snapshot.observedAt,
    snapshot.utcOffsetSeconds,
  );

  return (
    <div>
      <h2 className="text-sm font-medium text-foreground sm:text-base">
        Today&rsquo;s Weather
      </h2>

      <p className="mt-1 text-[clamp(3.25rem,13vw,5.5rem)] font-bold leading-none tracking-tight text-accent-text">
        {formatTemperature(snapshot.temperatureC)}
      </p>

      <dl className="mt-3 grid grid-cols-2 items-baseline gap-x-6 gap-y-1 sm:mt-4 sm:grid-cols-[auto_auto_1fr_auto] sm:gap-y-2">
        <div className="col-start-1 row-start-1 sm:col-span-4 sm:col-start-1 sm:row-start-1">
          <dt className="sr-only">Range</dt>
          <dd className="text-sm text-foreground sm:text-base">
            H: {formatTemperature(snapshot.highC)} L:{" "}
            {formatTemperature(snapshot.lowC)}
          </dd>
        </div>

        <div className="col-start-2 row-start-1 justify-self-end sm:col-start-4 sm:row-start-2 sm:justify-self-end">
          <dt className="sr-only">Conditions</dt>
          <dd className="text-sm text-muted-foreground sm:text-base">
            {snapshot.condition}
          </dd>
        </div>

        <div className="col-start-1 row-start-2 sm:col-start-1 sm:row-start-2">
          <dt className="sr-only">Location</dt>
          <dd className="text-sm font-semibold text-accent-text sm:text-base">
            {formatPlace(snapshot.city, snapshot.countryCode)}
          </dd>
        </div>

        <div className="col-start-2 row-start-2 justify-self-end sm:col-start-3 sm:row-start-2 sm:justify-self-end">
          <dt className="sr-only">Humidity</dt>
          <dd className="text-sm text-muted-foreground sm:text-base">
            Humidity: {snapshot.humidityPercent}%
          </dd>
        </div>

        <div className="col-start-2 row-start-3 justify-self-end sm:col-start-2 sm:row-start-2 sm:justify-self-start">
          <dt className="sr-only">Observed at</dt>
          <dd className="text-sm text-muted-foreground sm:text-base">
            <time dateTime={observedAtIso}>{timestamp}</time>
          </dd>
        </div>
      </dl>
    </div>
  );
}
