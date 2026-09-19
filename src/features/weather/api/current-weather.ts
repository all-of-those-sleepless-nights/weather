import type { CurrentWeatherDto } from "./dto";
import { requestOpenWeather } from "./openweather-client";

/** Current conditions at a coordinate, in metric units. */
export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<CurrentWeatherDto | null> {
  return requestOpenWeather<CurrentWeatherDto>("/data/2.5/weather", {
    lat: latitude,
    lon: longitude,
    units: "metric",
  });
}
