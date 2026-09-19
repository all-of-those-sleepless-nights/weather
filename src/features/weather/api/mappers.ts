import type { ResolvedPlace, WeatherSnapshot } from "../model/types";
import type { CurrentWeatherDto } from "./dto";

/**
 * The anti-corruption boundary: provider vocabulary in, our vocabulary out.
 *
 * Pure and synchronous, which makes the trickiest part of the integration —
 * field names, units, epoch conversion — testable without a network at all.
 */
export function toWeatherSnapshot(
  dto: CurrentWeatherDto,
  place: ResolvedPlace,
): WeatherSnapshot {
  const conditions = dto.weather?.[0];

  return {
    // The geocoder's name is preferred over the weather endpoint's, which
    // reports the nearest station and can differ from what the user searched.
    city: place.city,
    countryCode: place.countryCode || dto.sys?.country || "",
    temperatureC: dto.main.temp,
    highC: dto.main.temp_max,
    lowC: dto.main.temp_min,
    humidityPercent: dto.main.humidity,
    condition: conditions?.main ?? "Unknown",
    description: conditions?.description ?? "No description available",
    iconCode: conditions?.icon ?? "01d",
    observedAt: new Date(dto.dt * 1000),
    utcOffsetSeconds: dto.timezone ?? 0,
  };
}
