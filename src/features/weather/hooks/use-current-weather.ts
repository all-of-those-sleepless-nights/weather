import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isRetryable } from "@/lib/errors";
import { fetchWeatherForPlace } from "../api/weather-service";
import { placeQueryKey } from "../model/place-query";
import type { PlaceQuery, WeatherSnapshot } from "../model/types";

export const WEATHER_STALE_TIME_MS = 5 * 60_000;

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
