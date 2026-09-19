/** Same footprint as the summary, so the card does not jump when data lands. */
export function WeatherSummarySkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-4 w-32 animate-pulse rounded bg-surface-row" />
      <div className="mt-3 h-14 w-40 animate-pulse rounded bg-surface-row sm:h-20 sm:w-56" />
      <div className="mt-4 h-4 w-28 animate-pulse rounded bg-surface-row" />
      <div className="mt-2 h-4 w-44 animate-pulse rounded bg-surface-row" />
    </div>
  );
}
