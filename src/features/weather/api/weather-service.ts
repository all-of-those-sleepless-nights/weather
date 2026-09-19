import { InvalidPlaceError } from "@/lib/errors";
import type { PlaceQuery, WeatherSnapshot } from "../model/types";
import { fetchCurrentWeather } from "./current-weather";
import { resolvePlace } from "./geocoding";
import { toWeatherSnapshot } from "./mappers";

/**
 * The feature's only public entry point.
 *
 * Callers ask for weather at a place; that this currently takes two requests
 * against two endpoints is an implementation detail. Collapsing it back to a
 * single `?q=` call later would not change a line outside this file.
 */
export async function fetchWeatherForPlace(
  query: PlaceQuery,
): Promise<WeatherSnapshot> {
  const label = query.countryCode
    ? `${query.city}, ${query.countryCode}`
    : query.city;

  const place = await resolvePlace(query);
  if (!place) throw new InvalidPlaceError(label);

  const dto = await fetchCurrentWeather(place.latitude, place.longitude);
  // A place that geocoded but has no weather reading is, from the user's
  // point of view, the same dead end as one that does not exist.
  if (!dto) throw new InvalidPlaceError(label);

  return toWeatherSnapshot(dto, place);
}
