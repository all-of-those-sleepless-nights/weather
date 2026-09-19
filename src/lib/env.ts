/**
 * Typed access to build-time configuration.
 *
 * Failing loudly at startup beats a stream of confusing 401s from the API:
 * a missing key is a setup mistake, not a runtime condition to handle.
 */
export class MissingConfigError extends Error {
  constructor(key: string) {
    super(
      `Missing ${key}. Copy .env.example to .env.local and add your OpenWeather API key, then restart the dev server.`,
    );
    this.name = "MissingConfigError";
  }
}

export function getOpenWeatherApiKey(): string {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!key) throw new MissingConfigError("VITE_OPENWEATHER_API_KEY");
  return key;
}

export const OPENWEATHER_BASE_URL = "https://api.openweathermap.org";
