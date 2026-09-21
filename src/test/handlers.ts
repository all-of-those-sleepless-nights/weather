import { http, HttpResponse } from "msw";
import { johorGeocoding, johorWeather } from "./fixtures";

const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

/** "Johor" resolves, anything else is unknown. Tests override per case. */
export const handlers = [
  http.get(GEO_URL, ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? "";
    const isJohor = q.toLowerCase().startsWith("johor");
    return HttpResponse.json(isJohor ? [johorGeocoding] : []);
  }),

  http.get(WEATHER_URL, () => HttpResponse.json(johorWeather)),
];

export { GEO_URL, WEATHER_URL };
