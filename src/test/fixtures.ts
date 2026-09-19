import type {
  CurrentWeatherDto,
  GeocodingResultDto,
} from "@/features/weather/api/dto";

export const johorGeocoding: GeocodingResultDto = {
  name: "Johor",
  lat: 1.4854,
  lon: 103.7618,
  country: "MY",
};

export const johorWeather: CurrentWeatherDto = {
  weather: [
    { id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" },
  ],
  main: {
    temp: 26.4,
    feels_like: 28.1,
    temp_min: 25.8,
    temp_max: 29.2,
    pressure: 1009,
    humidity: 58,
  },
  dt: 1661996460, // 2022-09-01T01:41:00Z = 09:41am local in Johor (UTC+8)
  sys: { country: "MY" },
  timezone: 28800,
  name: "Johor",
  cod: 200,
};
