import { describe, expect, it } from "vitest";
import { weatherIconFor } from "./weather-icon-map";

describe("weatherIconFor", () => {
  it("uses the sun illustration while sun is still showing", () => {
    const sun = weatherIconFor("01d");
    expect(weatherIconFor("02n")).toBe(sun);
    expect(weatherIconFor("03d")).toBe(sun);
  });

  it("uses the cloud illustration from broken cloud onwards", () => {
    const cloud = weatherIconFor("04d");
    for (const code of ["09d", "10n", "11d", "13d", "50n"]) {
      expect(weatherIconFor(code)).toBe(cloud);
    }
  });

  it("distinguishes the two illustrations", () => {
    expect(weatherIconFor("01d")).not.toBe(weatherIconFor("04d"));
  });
});
