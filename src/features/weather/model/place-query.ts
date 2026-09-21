import * as z from "zod/mini";
import { isCountryCode } from "./country-codes";
import { PLACE_SEPARATOR } from "./place-input-mask";
import type { PlaceQuery } from "./types";

const PLACE_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} '’.-]*$/u;

const MAX_CITY_LENGTH = 80;

const collapseSpace = (value: string) => value.trim().replace(/\s+/g, " ");

function splitPlace(raw: string) {
  const [city = "", ...rest] = raw.split(PLACE_SEPARATOR);
  return {
    city: collapseSpace(city),
    country: collapseSpace(rest.join(PLACE_SEPARATOR)),
  };
}

const parsedFields = z.pipe(z.string(), z.transform(splitPlace));

export const placeQuerySchema = z.pipe(
  parsedFields.check(
    z.superRefine(({ city, country }, ctx) => {
      if (!city) {
        ctx.addIssue({ code: "custom", message: "Enter a city." });
      } else if (city.length > MAX_CITY_LENGTH) {
        ctx.addIssue({ code: "custom", message: "That city name is too long." });
      } else if (!PLACE_PATTERN.test(city)) {
        ctx.addIssue({
          code: "custom",
          message:
            "Use letters, numbers, spaces, hyphens, apostrophes and full stops.",
        });
      }

      // The geocoder only honours a two-letter ISO code here; anything else
      // is dropped and the search silently widens to every matching city.
      if (!country || isCountryCode(country)) return;

      ctx.addIssue({
        code: "custom",
        message:
          country.length === 2
            ? `"${country.toUpperCase()}" is not a country code. Try MY for Malaysia.`
            : "Use a two-letter country code, such as MY.",
      });
    }),
  ),
  z.transform(
    ({ city, country }): PlaceQuery =>
      country ? { city, countryCode: country.toUpperCase() } : { city },
  ),
);

export function validatePlaceQuery(
  input: string,
): { ok: true; query: PlaceQuery } | { ok: false; message: string } {
  const result = placeQuerySchema.safeParse(input);
  if (result.success) return { ok: true, query: result.data };

  return {
    ok: false,
    message: result.error.issues[0]?.message ?? "Enter a city.",
  };
}

/** Stable cache/identity key for a place, independent of casing and spacing. */
export function placeQueryKey(query: PlaceQuery): string {
  return `${query.city.toLowerCase()}|${(query.countryCode ?? "").toLowerCase()}`;
}
