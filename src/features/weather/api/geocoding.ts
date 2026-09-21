import type { PlaceQuery, ResolvedPlace } from "../model/types";
import type { GeocodingResultDto } from "./dto";
import { requestOpenWeather } from "./openweather-client";

export async function resolvePlace(
  query: PlaceQuery,
): Promise<ResolvedPlace | null> {
  const q = query.countryCode
    ? `${query.city},${query.countryCode}`
    : query.city;

  const results = await requestOpenWeather<GeocodingResultDto[]>(
    "/geo/1.0/direct",
    { q, limit: 1 },
  );

  const match = results?.[0];
  if (!match) return null;

  return {
    city: match.name,
    countryCode: match.country,
    latitude: match.lat,
    longitude: match.lon,
  };
}
