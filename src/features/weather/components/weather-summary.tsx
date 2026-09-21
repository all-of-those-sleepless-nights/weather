import type { ReactNode } from "react";
import { cn } from "cn";
import { ValueSwap } from "@/components/motion/value-swap";
import { formatPlace, formatTemperature, formatTimestamp } from "@/lib/format";
import type { WeatherSnapshot } from "../model/types";

type WeatherSummaryProps = {
  snapshot?: WeatherSnapshot;
  isStale?: boolean;
  status?: ReactNode;
};

export function WeatherSummary({
  snapshot,
  isStale = false,
  status,
}: WeatherSummaryProps) {
  return (
    <div
      className={`transition-opacity duration-300 ${isStale ? "opacity-50" : "opacity-100"}`}
    >
      <h2 className="text-sm font-medium text-foreground md:text-base">
        Today&rsquo;s Weather
      </h2>

      {status ? <div className="mt-2 md:max-w-[20rem]">{status}</div> : null}

      {snapshot ? <WeatherReadings snapshot={snapshot} /> : null}
    </div>
  );
}

type Reading = {
  /** The `<dt>`: names the value for assistive tech, hidden on screen. */
  term: string;
  /** Changing this cross-fades the cell. */
  swapKey: string;
  value: ReactNode;
  /** Grid placement, one clause per arrangement. */
  cell: string;
  /** Typography on the `<dd>`, over the muted default. */
  tone?: string;
  /** Alignment handed to the cross-fade wrapper. */
  align?: string;
};

/** The trailing column: right-aligned beside its label, left-aligned once
 *  the grid drops to one column. */
const TRAILING_CELL = "justify-self-end narrow:col-start-1 narrow:justify-self-start";
const TRAILING_ALIGN = "justify-items-end narrow:justify-items-start";

function readingsFor(snapshot: WeatherSnapshot): Reading[] {
  const observedAtIso = snapshot.observedAt.toISOString();
  const range = `H: ${formatTemperature(snapshot.highC)} L: ${formatTemperature(snapshot.lowC)}`;
  const place = formatPlace(snapshot.city, snapshot.countryCode);
  const humidity = `Humidity: ${snapshot.humidityPercent}%`;
  const timestamp = formatTimestamp(
    snapshot.observedAt,
    snapshot.utcOffsetSeconds,
  );

  // Listed in the order a phone reads them: left to right, top to bottom.
  return [
    {
      term: "Range",
      swapKey: range,
      value: range,
      cell: "col-start-1 row-start-1 narrow:text-center @xl:col-span-4 @xl:col-start-1 @xl:row-start-1",
      tone: "text-foreground @xl:text-base",
    },
    {
      term: "Conditions",
      swapKey: snapshot.condition,
      value: snapshot.condition,
      cell: `col-start-2 row-start-1 narrow:row-start-3 @xl:col-start-4 @xl:row-start-2 @xl:justify-self-end ${TRAILING_CELL}`,
      align: TRAILING_ALIGN,
    },
    {
      term: "Location",
      swapKey: place,
      value: place,
      cell: "col-start-1 row-start-2 @xl:col-start-1 @xl:row-start-2",
      tone: "font-semibold",
    },
    {
      term: "Humidity",
      swapKey: humidity,
      value: humidity,
      cell: `col-start-2 row-start-2 narrow:row-start-4 @xl:col-start-3 @xl:row-start-2 @xl:justify-self-end ${TRAILING_CELL}`,
      align: TRAILING_ALIGN,
    },
    {
      term: "Observed at",
      swapKey: observedAtIso,
      value: <time dateTime={observedAtIso}>{timestamp}</time>,
      cell: `col-start-2 row-start-3 narrow:row-start-5 @xl:col-start-2 @xl:row-start-2 @xl:justify-self-start ${TRAILING_CELL}`,
      tone: "@max-xl:text-right narrow:text-left",
      align: `${TRAILING_ALIGN} @xl:justify-items-start`,
    },
  ];
}

function WeatherReadings({ snapshot }: { snapshot: WeatherSnapshot }) {
  const temperature = formatTemperature(snapshot.temperatureC);

  return (
    <>
      <p className="mt-1 text-[clamp(3.75rem,13vw,5.5rem)] font-bold leading-none tracking-tight text-accent-text narrow:text-center">
        <ValueSwap swapKey={temperature}>{temperature}</ValueSwap>
      </p>

      {/* One description list, three arrangements: one column below 400px, two
          on a phone, one row once the card itself clears 576px. Each entry is
          placed by grid coordinate, so it appears in the DOM exactly once. */}
      <dl className="text-sm @xl:text-lg mt-1 grid grid-cols-2 narrow:grid-cols-1 items-baseline gap-x-6 @xl:gap-x-4 gap-y-1 @xl:grid-cols-[auto_auto_1fr_auto] @xl:gap-y-1">
        {readingsFor(snapshot).map(({ term, swapKey, value, cell, tone, align }) => (
          <div key={term} className={cell}>
            <dt className="sr-only">{term}</dt>
            <dd className={cn("text-muted-foreground/70", tone)}>
              <ValueSwap swapKey={swapKey} className={align}>
                {value}
              </ValueSwap>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
