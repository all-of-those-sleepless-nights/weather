import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isRetryable } from "@/lib/errors";
import { fetchWeatherForPlace } from "../api/weather-service";
import { placeQueryKey } from "../model/place-query";
import type { PlaceQuery, WeatherSnapshot } from "../model/types";

export const WEATHER_STALE_TIME_MS = 5 * 60_000;

/**
 * Current weather for a place, or idle until one is submitted.
 *
 * React Query earns its place here for caching, request de-duplication and
 * the loading/error state machine — not for pagination, of which there is
 * none. The retry predicate is the important part: a mistyped city must
 * surface its message immediately rather than after three futile attempts.
 *
 * `keepPreviousData` keeps the last reading on screen while the next one
 * loads. Without it every search swaps the card for a skeleton of a different
 * height and drops the illustration, so the whole composition jumps twice per
 * search; with it the values update in place.
 */
export function useCurrentWeather(query: PlaceQuery | null) {
  return useQuery<WeatherSnapshot>({
    queryKey: ["weather", query ? placeQueryKey(query) : "idle"],
    queryFn: () => fetchWeatherForPlace(query!),
    enabled: query !== null,
    placeholderData: keepPreviousData,
    staleTime: WEATHER_STALE_TIME_MS,
    retry: (failureCount, error) => isRetryable(error) && failureCount < 2,
    refetchOnWindowFocus: false,
  });
}
