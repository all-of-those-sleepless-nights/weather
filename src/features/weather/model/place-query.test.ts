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

  it("accepts a spelled-out country, which the geocoder also resolves", () => {
    expect(validatePlaceQuery("Kuala Lumpur, Malaysia")).toEqual({
      ok: true,
      query: { city: "Kuala Lumpur", countryCode: "Malaysia" },
    });
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
      query: { city: "kuala lumpur", countryCode: "my" },
    });
  });

  it("accepts non-Latin scripts and the punctuation place names carry", () => {
    expect(validatePlaceQuery("Ōsaka, JP").ok).toBe(true);
    expect(validatePlaceQuery("Tokusan-ri, KR").ok).toBe(true);
    expect(validatePlaceQuery("L'Aquila, IT").ok).toBe(true);
  });

  it("rejects a full stop, which the mask turns into the separator", () => {
    expect(message("St. Louis")).toMatch(/letters, spaces/i);
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
