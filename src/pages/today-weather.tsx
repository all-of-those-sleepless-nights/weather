import { useCallback, useState } from "react";
import { WeatherLayout } from "@/components/layouts/weather-layout";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { WeatherCard } from "@/features/weather/components/weather-card";
import { WeatherError } from "@/features/weather/components/weather-error";
import { WeatherSearchForm } from "@/features/weather/components/weather-search-form";
import { WeatherSummary } from "@/features/weather/components/weather-summary";
import { useCurrentWeather } from "@/features/weather/hooks/use-current-weather";
import type { PlaceQuery } from "@/features/weather/model/types";
import { SearchHistoryPanel } from "@/features/search-history/components/search-history-panel";
import { useSearchHistory } from "@/features/search-history/hooks/use-search-history";
import type { SearchHistoryRepository } from "@/features/search-history/repository/search-history-repository";
import type { SearchHistoryEntry } from "@/features/search-history/model/types";

type TodayWeatherProps = {
  /** Injected in tests; production uses the localStorage adapter. */
  historyRepository?: SearchHistoryRepository;
};

/** Wiring only: owns the active place, delegates fetching and persistence. */
export default function TodayWeather({
  historyRepository,
}: TodayWeatherProps = {}) {
  const [activeQuery, setActiveQuery] = useState<PlaceQuery | null>(null);
  const history = useSearchHistory(historyRepository);
  const { data, error, isFetching, refetch } = useCurrentWeather(activeQuery);

  // A failed lookup clears the card rather than leaving the last city's
  // numbers under a "not found" message.
  const snapshot = error ? undefined : data;

  const addToHistory = history.add;

  const handleSearch = useCallback(
    (query: PlaceQuery) => {
      setActiveQuery(query);
      // Recorded on intent, so a failed lookup can be retried from the list.
      addToHistory({ city: query.city, countryCode: query.countryCode });
    },
    [addToHistory],
  );

  const handleHistorySearch = useCallback(
    (entry: SearchHistoryEntry) => {
      const query: PlaceQuery = {
        city: entry.city,
        countryCode: entry.countryCode,
      };
      const isSamePlace =
        activeQuery?.city === query.city &&
        activeQuery?.countryCode === query.countryCode;

      handleSearch(query);
      // Same place, same query key: force a network call.
      if (isSamePlace) void refetch();
    },
    [activeQuery, handleSearch, refetch],
  );

  return (
    <WeatherLayout>
      <div className="relative z-20 flex w-full items-start gap-2 md:gap-4">
        <ThemeToggle />
        <WeatherSearchForm onSearch={handleSearch} isSearching={isFetching} />
      </div>

      <WeatherCard snapshot={snapshot} hasError={Boolean(error)}>
        {/* One card in every state; this line carries the prompt or error. */}
        <div role="status" aria-live="polite" aria-busy={isFetching}>
          <WeatherSummary
            snapshot={snapshot}
            isStale={isFetching}
            status={
              error ? (
                <WeatherError error={error} />
              ) : snapshot ? null : (
                <p className="text-base text-muted-foreground">
                  Search for a city to see its current conditions.
                </p>
              )
            }
          />
        </div>

        <SearchHistoryPanel
          entries={history.entries}
          onSearch={handleHistorySearch}
          onRemove={history.remove}
        />
      </WeatherCard>
    </WeatherLayout>
  );
}
