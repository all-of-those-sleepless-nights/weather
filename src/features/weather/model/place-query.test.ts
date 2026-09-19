import { describe, expect, it } from "vitest";
import { placeQueryKey, validatePlaceQuery } from "./place-query";

const ok = (city: string, countryCode = "") =>
  validatePlaceQuery({ city, countryCode });

describe("validatePlaceQuery", () => {
  it("normalises spacing and upper-cases the country", () => {
    expect(ok("  kuala   lumpur ", " my ")).toEqual({
      ok: true,
      query: { city: "kuala lumpur", countryCode: "MY" },
    });
  });

  it("treats the country as optional", () => {
    expect(ok("Singapore")).toEqual({ ok: true, query: { city: "Singapore" } });
  });

  it("accepts non-Latin scripts and the punctuation place names carry", () => {
    expect(ok("Ōsaka", "jp").ok).toBe(true);
    expect(ok("Tokusan-ri", "KR").ok).toBe(true);
    expect(ok("L'Aquila", "IT").ok).toBe(true);
  });

  it("rejects a blank city", () => {
    expect(ok("   ", "MY")).toEqual({
      ok: false,
      errors: { city: "Enter a city." },
    });
  });

  it("points a comma-separated entry at the country field", () => {
    const result = ok("Johor, MY");

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.city).toMatch(/own field/i);
  });

  it("requires a two-letter country code", () => {
    const result = ok("Johor", "MYS");

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.errors.countryCode).toMatch(
      /two-letter/i,
    );
  });

  it("reports both fields at once", () => {
    const result = ok("", "MYS");

    expect(result.ok === false && Object.keys(result.errors)).toEqual([
      "city",
      "countryCode",
    ]);
  });
});

describe("placeQueryKey", () => {
  it("ignores casing so cached entries are shared", () => {
    expect(placeQueryKey({ city: "Johor", countryCode: "MY" })).toBe(
      placeQueryKey({ city: "johor", countryCode: "my" }),
    );
  });

  it("distinguishes a bare city from a city with a country", () => {
    expect(placeQueryKey({ city: "Johor" })).not.toBe(
      placeQueryKey({ city: "Johor", countryCode: "MY" }),
    );
  });
});
