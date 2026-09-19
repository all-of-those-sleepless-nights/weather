/**
 * The shape the UI consumes.
 *
 * Deliberately not the provider's shape: everything the components render is
 * named in our own vocabulary and already in our own units, so a change on
 * the other side of the network stops at the mapper.
 */
export type WeatherSnapshot = {
  city: string;
  countryCode: string;
  temperatureC: number;
  highC: number;
  lowC: number;
  humidityPercent: number;
  /** Condition group, e.g. "Clouds" — what the mockup shows. */
  condition: string;
  /** Long form, e.g. "scattered clouds" — used as the icon's text alternative. */
  description: string;
  /** Provider icon code such as "04d", mapped to a local asset for display. */
  iconCode: string;
  observedAt: Date;
  /** The searched city's offset from UTC, in seconds. */
  utcOffsetSeconds: number;
};

/** A place the user asked about, before it has been resolved to coordinates. */
export type PlaceQuery = {
  city: string;
  countryCode?: string;
};

/** A place resolved to coordinates by the geocoding service. */
export type ResolvedPlace = {
  city: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};
