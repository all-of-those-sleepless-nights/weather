import type { PlaceQuery } from "./types";

/**
 * Parses the single search field into a city and an optional country.
 *
 * The mockup shows one input while the brief asks for city *and* country, so
 * the field accepts `City, Country` and splits on the comma. A bare city is
 * valid — the geocoder resolves it to its best match.
 */
export function parsePlaceQuery(input: string): PlaceQuery | null {
  const trimmed = input.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;

  const [city, ...rest] = trimmed.split(",").map((part) => part.trim());
  if (!city) return null;

  const countryCode = rest.filter(Boolean).join(",") || undefined;
  return countryCode ? { city, countryCode } : { city };
}

/** Stable cache/identity key for a place, independent of casing and spacing. */
export function placeQueryKey(query: PlaceQuery): string {
  return `${query.city.toLowerCase()}|${(query.countryCode ?? "").toLowerCase()}`;
}
