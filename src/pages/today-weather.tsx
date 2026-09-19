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

/**
 * Composes the page and owns the one piece of state the pieces share: which
 * place is currently being shown. Fetching belongs to the query hook and
 * persistence to the history repository, so this file stays a wiring layer.
 */
export default function TodayWeather({
  historyRepository,
}: TodayWeatherProps = {}) {
  const [activeQuery, setActiveQuery] = useState<PlaceQuery | null>(null);
  const history = useSearchHistory(historyRepository);
  const { data, error, isFetching, refetch } = useCurrentWeather(activeQuery);

  // A failed lookup shows no reading at all: the card falls back to its
  // placeholders rather than leaving the previous city's numbers under a
  // message saying the city could not be found.
  const snapshot = error ? undefined : data;

  const addToHistory = history.add;

  const handleSearch = useCallback(
    (query: PlaceQuery) => {
      setActiveQuery(query);
      // Recorded on intent rather than on success: the brief's history is a
      // log of what was searched, and a failed lookup is still worth a retry.
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
      // Re-selecting the place already on screen would otherwise be served
      // from cache; the brief asks for the API to be called again.
      if (isSamePlace) void refetch();
    },
    [activeQuery, handleSearch, refetch],
  );

  return (
    <WeatherLayout>
      {/* Both controls are the same square: the theme switch leads the row,
          the submit button closes it. */}
      <div className="flex w-full shrink-0 items-start gap-3">
        <ThemeToggle />
        <WeatherSearchForm onSearch={handleSearch} isSearching={isFetching} />
      </div>

      <WeatherCard snapshot={snapshot}>
        {/* One card in every state. The reading keeps its labels and shows a
            dash per value until there is something to put there, so nothing
            below it moves when a search lands or fails. */}
        <div
          role="status"
          aria-live="polite"
          aria-busy={isFetching}
          className="shrink-0"
        >
          <WeatherSummary
            snapshot={snapshot}
            isStale={isFetching}
            status={
              error ? (
                <WeatherError error={error} />
              ) : snapshot ? null : (
                <p className="text-sm text-muted-foreground">
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
