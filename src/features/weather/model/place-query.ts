// `zod/mini` rather than `zod`: same validators, composed as functions
// instead of chained methods, and tree-shakeable. Measured on this bundle,
// full zod costs 24.2 kB gzipped and mini costs 5.5 kB — worth the slightly
// more verbose `z.pipe(...)` for one form. Swapping back is one import plus
// re-chaining the calls below.
import * as z from "zod/mini";
import type { PlaceQuery } from "./types";

/**
 * A city name: letters in any script, plus the punctuation real place names
 * carry. Notably it rejects commas, because the form now owns the separator
 * and a comma in the city box means the country went in the wrong field.
 */
const CITY_PATTERN = /^[\p{L}\p{N}][\p{L}\p{M}\p{N} '’./-]*$/u;

/** ISO 3166-1 alpha-2, which is what the OpenWeather geocoder matches on. */
const COUNTRY_PATTERN = /^[A-Z]{2}$/;

const collapseSpace = (value: string) => value.trim().replace(/\s+/g, " ");

/**
 * Validates and normalises the search form into a domain `PlaceQuery`.
 *
 * Normalisation runs before the checks, so "  kuala   lumpur " and
 * "Kuala Lumpur" reach the geocoder — and the query cache — identically.
 * The country is optional: the geocoder resolves a bare city to its best
 * match, which is the behaviour the mockup's single field implied.
 */
const normalisedFields = z
  .object({
    city: z.pipe(z.string(), z.transform(collapseSpace)),
    countryCode: z.pipe(
      z.string(),
      z.transform((value: string) => collapseSpace(value).toUpperCase()),
    ),
  })
  .check(z.superRefine((value, ctx) => {
    if (!value.city) {
      ctx.addIssue({
        code: "custom",
        path: ["city"],
        message: "Enter a city.",
      });
    } else if (value.city.length > 80) {
      ctx.addIssue({
        code: "custom",
        path: ["city"],
        message: "That city name is too long.",
      });
    } else if (!CITY_PATTERN.test(value.city)) {
      ctx.addIssue({
        code: "custom",
        path: ["city"],
        message: value.city.includes(",")
          ? "Put the country in its own field."
          : "Use letters, spaces, hyphens and apostrophes only.",
      });
    }

    if (value.countryCode && !COUNTRY_PATTERN.test(value.countryCode)) {
      ctx.addIssue({
        code: "custom",
        path: ["countryCode"],
        message: "Use a two-letter country code, such as MY.",
      });
    }
  }));

export const placeQuerySchema = z.pipe(
  normalisedFields,
  z.transform(
    ({ city, countryCode }): PlaceQuery =>
      countryCode ? { city, countryCode } : { city },
  ),
);

export type PlaceQueryFields = { city: string; countryCode: string };

/** First message per field, in the shape the form renders. */
export type PlaceQueryErrors = Partial<Record<keyof PlaceQueryFields, string>>;

export function validatePlaceQuery(
  fields: PlaceQueryFields,
): { ok: true; query: PlaceQuery } | { ok: false; errors: PlaceQueryErrors } {
  const result = placeQuerySchema.safeParse(fields);
  if (result.success) return { ok: true, query: result.data };

  const errors: PlaceQueryErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path?.[0];
    if ((field === "city" || field === "countryCode") && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { ok: false, errors };
}

/** Stable cache/identity key for a place, independent of casing and spacing. */
export function placeQueryKey(query: PlaceQuery): string {
  return `${query.city.toLowerCase()}|${(query.countryCode ?? "").toLowerCase()}`;
}
