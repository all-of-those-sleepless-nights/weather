import type { PlaceQuery, ResolvedPlace } from "../model/types";
import type { GeocodingResultDto } from "./dto";
import { requestOpenWeather } from "./openweather-client";

/**
 * Resolves a typed city (and optional country) to coordinates.
 *
 * Using the Geocoding API rather than the weather endpoint's own `q=` lookup
 * gives an unambiguous answer to "does this place exist?" — an empty array —
 * which is distinguishable from a network failure. That distinction is what
 * lets the UI show "we couldn't find X" only when it is actually true.
 */
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
