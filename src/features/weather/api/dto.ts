export type GeocodingResultDto = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
};

export type CurrentWeatherDto = {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  dt: number;
  sys: {
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  timezone: number;
  name: string;
  cod: number | string;
};
