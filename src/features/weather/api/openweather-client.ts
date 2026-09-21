import { OPENWEATHER_BASE_URL, getOpenWeatherApiKey } from "@/lib/env";
import {
  NetworkError,
  RateLimitError,
  UnauthorizedError,
  UnknownApiError,
} from "@/lib/errors";

const REQUEST_TIMEOUT_MS = 10_000;

export async function requestOpenWeather<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<T | null> {
  const url = new URL(path, OPENWEATHER_BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set("appid", getOpenWeatherApiKey());

  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
  } catch (cause) {
    throw new NetworkError(cause);
  }

  // 400 is the geocoder's answer to a query it cannot parse, which for the
  // user is the same outcome as 404: no such place.
  if (response.status === 404 || response.status === 400) return null;
  if (response.status === 401) throw new UnauthorizedError();
  if (response.status === 429) throw new RateLimitError();
  if (!response.ok) throw new UnknownApiError(response.status);

  try {
    return (await response.json()) as T;
  } catch {
    throw new UnknownApiError(response.status);
  }
}
