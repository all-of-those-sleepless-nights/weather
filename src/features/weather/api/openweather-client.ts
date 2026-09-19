import { OPENWEATHER_BASE_URL, getOpenWeatherApiKey } from "@/lib/env";
import {
  NetworkError,
  RateLimitError,
  UnauthorizedError,
  UnknownApiError,
} from "@/lib/errors";

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * The single place that speaks HTTP to OpenWeather.
 *
 * Its job is to turn transport concerns — status codes, timeouts, dropped
 * connections — into the domain error taxonomy, so that no caller upstream
 * ever inspects a status code. A 404 is deliberately *not* handled here:
 * "not found" means different things per endpoint, so each caller decides.
 */
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
    // fetch only rejects for transport failures and aborts; everything else
    // arrives as a non-ok Response.
    throw new NetworkError(cause);
  }

  if (response.status === 404) return null;
  if (response.status === 401) throw new UnauthorizedError();
  if (response.status === 429) throw new RateLimitError();
  if (!response.ok) throw new UnknownApiError(response.status);

  try {
    return (await response.json()) as T;
  } catch {
    throw new UnknownApiError(response.status);
  }
}
