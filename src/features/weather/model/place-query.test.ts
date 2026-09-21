import { describe, expect, it } from "vitest";
import { placeQueryKey, validatePlaceQuery } from "./place-query";

const message = (input: string) => {
  const result = validatePlaceQuery(input);
  return result.ok ? null : result.message;
};

describe("validatePlaceQuery", () => {
  it("splits city and country on the separator", () => {
    expect(validatePlaceQuery("Johor,MY")).toEqual({
      ok: true,
      query: { city: "Johor", countryCode: "MY" },
    });
  });

  it("normalises the country code to upper case", () => {
    expect(validatePlaceQuery("Johor, my")).toEqual({
      ok: true,
      query: { city: "Johor", countryCode: "MY" },
    });
  });

  it("rejects a spelled-out country, which the geocoder silently drops", () => {
    expect(message("Kuala Lumpur, Malaysia")).toMatch(/two-letter country code/i);
    expect(message("test, what the duck")).toMatch(/two-letter country code/i);
  });

  it("rejects two letters that are not an assigned ISO code", () => {
    expect(message("London, UK")).toMatch(/not a country code/i);
    expect(message("Asdfgh, ZZ")).toMatch(/not a country code/i);
  });

  it("treats the country as optional", () => {
    expect(validatePlaceQuery("Singapore")).toEqual({
      ok: true,
      query: { city: "Singapore" },
    });
  });

  it("normalises spacing so the cache key is stable", () => {
    expect(validatePlaceQuery("  kuala   lumpur ,  my ")).toEqual({
      ok: true,
      query: { city: "kuala lumpur", countryCode: "MY" },
    });
  });

  it("accepts non-Latin scripts and the punctuation place names carry", () => {
    expect(validatePlaceQuery("Ōsaka, JP").ok).toBe(true);
    expect(validatePlaceQuery("Tokusan-ri, KR").ok).toBe(true);
    expect(validatePlaceQuery("L'Aquila, IT").ok).toBe(true);
  });

  it("accepts the full stop that abbreviated place names carry", () => {
    expect(validatePlaceQuery("St. Louis, US")).toEqual({
      ok: true,
      query: { city: "St. Louis", countryCode: "US" },
    });
  });

  it("accepts the digits that dated place names carry", () => {
    expect(validatePlaceQuery("25 de Mayo, AR")).toEqual({
      ok: true,
      query: { city: "25 de Mayo", countryCode: "AR" },
    });
    expect(validatePlaceQuery("Villa 25 de Mayo, AR").ok).toBe(true);
  });

  it("rejects a blank city", () => {
    expect(message("")).toMatch(/enter a city/i);
    expect(message("   ")).toMatch(/enter a city/i);
    expect(message(", MY")).toMatch(/enter a city/i);
  });

  it("rejects characters that cannot be in a place name", () => {
    expect(message("<script>")).toMatch(/letters/i);
  });

  it("rejects an overlong entry rather than sending it", () => {
    expect(message("a".repeat(81))).toMatch(/too long/i);
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
