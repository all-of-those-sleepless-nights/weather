import type { ReactNode } from "react";
import { ValueSwap } from "@/components/motion/value-swap";
import { formatPlace, formatTemperature, formatTimestamp } from "@/lib/format";
import type { WeatherSnapshot } from "../model/types";

type WeatherSummaryProps = {
  /** Absent before the first reading, and while an error is being shown. */
  snapshot?: WeatherSnapshot;
  /** True while a newer reading is in flight and this one is the old one. */
  isStale?: boolean;
  /** The line under the heading: the opening prompt, or an error. */
  status?: ReactNode;
};

/** Stands in for a value there is nothing to show for yet. */
const NO_VALUE = "-";

/**
 * The headline reading.
 *
 * The two mockups arrange the metadata differently — mobile as two columns,
 * desktop as one aligned row beneath the range. Rather than render both and
 * hide one, every fact appears in the DOM exactly once and is placed by
 * explicit grid coordinates per breakpoint. Duplicating the markup would
 * mean a screen reader announcing the humidity twice.
 *
 * The same markup carries the empty and error states, with every value
 * replaced by a dash and its label left in place. A card that keeps its shape
 * shows what a reading is going to contain, and there is no second layout to
 * cross-fade from when one arrives.
 *
 * Each value cross-fades on change rather than cutting. The previous reading
 * stays on screen while the next loads, dimmed, so the numbers change in
 * place.
 */
export function WeatherSummary({
  snapshot,
  isStale = false,
  status,
}: WeatherSummaryProps) {
  const observedAtIso = snapshot?.observedAt.toISOString();
  // The degree sign stays on the placeholder: at this size a lone dash is a
  // 90px bar that reads as a loading indicator rather than an empty slot.
  const temperature = snapshot
    ? formatTemperature(snapshot.temperatureC)
    : `${NO_VALUE}°`;
  const high = snapshot ? formatTemperature(snapshot.highC) : NO_VALUE;
  const low = snapshot ? formatTemperature(snapshot.lowC) : NO_VALUE;
  const range = `H: ${high} L: ${low}`;
  const place = snapshot
    ? formatPlace(snapshot.city, snapshot.countryCode)
    : NO_VALUE;
  const humidity = `Humidity: ${snapshot ? `${snapshot.humidityPercent}%` : NO_VALUE}`;
  const condition = snapshot?.condition ?? NO_VALUE;
  const timestamp =
    snapshot && observedAtIso
      ? formatTimestamp(snapshot.observedAt, snapshot.utcOffsetSeconds)
      : NO_VALUE;

  return (
    <div
      className={`transition-opacity duration-300 ${isStale ? "opacity-50" : "opacity-100"}`}
    >
      <h2 className="text-sm font-medium text-foreground sm:text-base">
        Today&rsquo;s Weather
      </h2>

      {/* Kept clear of the illustration, which overlaps the card's top-right
          corner and would otherwise swallow the end of a long message. */}
      {status ? <div className="mt-2 sm:max-w-[20rem]">{status}</div> : null}

      <p className="mt-1 text-[clamp(3.25rem,13vw,5.5rem)] font-bold leading-none tracking-tight text-accent-text">
        <ValueSwap swapKey={temperature}>{temperature}</ValueSwap>
      </p>

      <dl className="mt-3 grid grid-cols-2 items-baseline gap-x-6 gap-y-1 sm:mt-4 sm:grid-cols-[auto_auto_1fr_auto] sm:gap-y-2">
        <div className="col-start-1 row-start-1 sm:col-span-4 sm:col-start-1 sm:row-start-1">
          <dt className="sr-only">Range</dt>
          <dd className="text-sm text-foreground sm:text-base">
            <ValueSwap swapKey={range}>{range}</ValueSwap>
          </dd>
        </div>

        <div className="col-start-2 row-start-1 justify-self-end sm:col-start-4 sm:row-start-2 sm:justify-self-end">
          <dt className="sr-only">Conditions</dt>
          <dd className="text-sm text-muted-foreground sm:text-base">
            <ValueSwap swapKey={condition} className="justify-items-end">
              {condition}
            </ValueSwap>
          </dd>
        </div>

        <div className="col-start-1 row-start-2 sm:col-start-1 sm:row-start-2">
          <dt className="sr-only">Location</dt>
          <dd className="text-sm font-semibold text-accent-text sm:text-base">
            <ValueSwap swapKey={place}>{place}</ValueSwap>
          </dd>
        </div>

        <div className="col-start-2 row-start-2 justify-self-end sm:col-start-3 sm:row-start-2 sm:justify-self-end">
          <dt className="sr-only">Humidity</dt>
          <dd className="text-sm text-muted-foreground sm:text-base">
            <ValueSwap swapKey={humidity} className="justify-items-end">
              {humidity}
            </ValueSwap>
          </dd>
        </div>

        <div className="col-start-2 row-start-3 justify-self-end sm:col-start-2 sm:row-start-2 sm:justify-self-start">
          <dt className="sr-only">Observed at</dt>
          <dd className="text-sm text-muted-foreground sm:text-base">
            <ValueSwap
              swapKey={observedAtIso ?? NO_VALUE}
              className="justify-items-end sm:justify-items-start"
            >
              {observedAtIso ? (
                <time dateTime={observedAtIso}>{timestamp}</time>
              ) : (
                timestamp
              )}
            </ValueSwap>
          </dd>
        </div>
      </dl>
    </div>
  );
}
