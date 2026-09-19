import { describe, expect, it } from "vitest";
import { parsePlaceQuery, placeQueryKey } from "./parse-place-query";

describe("parsePlaceQuery", () => {
  it("splits city and country on the comma", () => {
    expect(parsePlaceQuery("Johor, MY")).toEqual({
      city: "Johor",
      countryCode: "MY",
    });
  });

  it("accepts a bare city", () => {
    expect(parsePlaceQuery("Singapore")).toEqual({ city: "Singapore" });
  });

  it("tolerates untidy spacing", () => {
    expect(parsePlaceQuery("  Tokusan-ri ,  KR ")).toEqual({
      city: "Tokusan-ri",
      countryCode: "KR",
    });
  });

  it("rejects blank input", () => {
    expect(parsePlaceQuery("")).toBeNull();
    expect(parsePlaceQuery("   ")).toBeNull();
    expect(parsePlaceQuery(" , MY")).toBeNull();
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
