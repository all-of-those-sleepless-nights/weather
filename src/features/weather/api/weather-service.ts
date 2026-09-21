import { InvalidPlaceError } from "@/lib/errors";
import type { PlaceQuery, WeatherSnapshot } from "../model/types";
import { fetchCurrentWeather } from "./current-weather";
import { resolvePlace } from "./geocoding";
import { toWeatherSnapshot } from "./mappers";

export async function fetchWeatherForPlace(
  query: PlaceQuery,
): Promise<WeatherSnapshot> {
  const label = query.countryCode
    ? `${query.city}, ${query.countryCode}`
    : query.city;

  const place = await resolvePlace(query);
  if (!place) throw new InvalidPlaceError(label);

  const dto = await fetchCurrentWeather(place.latitude, place.longitude);
  if (!dto) throw new InvalidPlaceError(label);

  return toWeatherSnapshot(dto, place);
}
