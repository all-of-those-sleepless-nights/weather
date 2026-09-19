import { describe, expect, it } from "vitest";
import { johorGeocoding, johorWeather } from "@/test/fixtures";
import { toWeatherSnapshot } from "./mappers";
import type { ResolvedPlace } from "../model/types";

const place: ResolvedPlace = {
  city: johorGeocoding.name,
  countryCode: johorGeocoding.country,
  latitude: johorGeocoding.lat,
  longitude: johorGeocoding.lon,
};

describe("toWeatherSnapshot", () => {
  it("maps provider fields onto the domain model", () => {
    const snapshot = toWeatherSnapshot(johorWeather, place);

    expect(snapshot).toMatchObject({
      city: "Johor",
      countryCode: "MY",
      temperatureC: 26.4,
      highC: 29.2,
      lowC: 25.8,
      humidityPercent: 58,
      condition: "Clouds",
      description: "scattered clouds",
      iconCode: "03d",
    });
  });

  it("converts the unix timestamp to a Date", () => {
    const snapshot = toWeatherSnapshot(johorWeather, place);

    expect(snapshot.observedAt).toBeInstanceOf(Date);
    expect(snapshot.observedAt.getTime()).toBe(johorWeather.dt * 1000);
  });

  it("prefers the geocoded place name over the reporting station's", () => {
    const stationElsewhere = { ...johorWeather, name: "Pasir Gudang" };

    expect(toWeatherSnapshot(stationElsewhere, place).city).toBe("Johor");
  });

  it("falls back rather than throwing when conditions are absent", () => {
    const withoutWeather = { ...johorWeather, weather: [] };
    const snapshot = toWeatherSnapshot(withoutWeather, place);

    expect(snapshot.condition).toBe("Unknown");
    expect(snapshot.iconCode).toBe("01d");
  });
});
