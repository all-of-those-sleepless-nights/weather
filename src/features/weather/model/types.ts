export type WeatherSnapshot = {
  city: string;
  countryCode: string;
  temperatureC: number;
  highC: number;
  lowC: number;
  humidityPercent: number;
  /** Condition group, e.g. "Clouds". */
  condition: string;
  /** Long form, e.g. "scattered clouds"; the icon's text alternative. */
  description: string;
  /** Provider code such as "04d", mapped to a local asset. */
  iconCode: string;
  observedAt: Date;
  /** The searched city's offset from UTC, in seconds. */
  utcOffsetSeconds: number;
};

/** A place as typed, before geocoding. */
export type PlaceQuery = {
  city: string;
  countryCode?: string;
};

/** A place after geocoding. */
export type ResolvedPlace = {
  city: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};
