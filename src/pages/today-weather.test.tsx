import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw-server";
import { GEO_URL, WEATHER_URL } from "@/test/handlers";
import { johorGeocoding, johorWeather } from "@/test/fixtures";
import { renderApp } from "@/test/render-app";
import TodayWeather from "./today-weather";

async function search(term: string) {
  const user = userEvent.setup();
  await user.clear(screen.getByLabelText(/city, country/i));
  await user.type(screen.getByLabelText(/city, country/i), term);
  await user.click(screen.getByRole("button", { name: /search for weather/i }));
  return user;
}

describe("Today's Weather", () => {
  it("shows a prompt before anything has been searched", () => {
    renderApp(<TodayWeather />);

    expect(screen.getByText(/search for a city/i)).toBeInTheDocument();
  });

  it("renders the reading for a city that exists", async () => {
    renderApp(<TodayWeather />);
    await search("Johor, MY");

    expect(await screen.findByText("26°")).toBeInTheDocument();
    expect(screen.getByText("H: 29° L: 26°")).toBeInTheDocument();
    expect(screen.getAllByText("Johor, MY").length).toBeGreaterThan(0);
    expect(screen.getByText(/humidity: 58%/i)).toBeInTheDocument();
    expect(screen.getByText("Clouds")).toBeInTheDocument();
  });

  it("shows the observation time in the searched city's timezone", async () => {
    renderApp(<TodayWeather />);
    await search("Johor, MY");

    // dt 1662024060 is 01:41 UTC; Johor reports a +8h offset.
    expect(
      await screen.findByText("01-09-2022 09:41am"),
    ).toBeInTheDocument();
  });

  it("explains an unknown place instead of failing silently", async () => {
    renderApp(<TodayWeather />);
    await search("Asdfgh, ZZ");

    expect(await screen.findByText(/couldn't find asdfgh, zz/i)).toBeInTheDocument();
    expect(screen.queryByText("26°")).not.toBeInTheDocument();
  });

  it("reports a network failure rather than showing a blank card", async () => {
    server.use(http.get(GEO_URL, () => HttpResponse.error()));
    renderApp(<TodayWeather />);
    await search("Johor, MY");

    expect(
      await screen.findByText(/couldn't reach the weather service/i),
    ).toBeInTheDocument();
  });

  it("names the API key when the service rejects it", async () => {
    server.use(
      http.get(GEO_URL, () => new HttpResponse(null, { status: 401 })),
    );
    renderApp(<TodayWeather />);
    await search("Johor, MY");

    expect(
      await screen.findByText(/rejected our api key/i),
    ).toBeInTheDocument();
  });

  it("does not search on empty input", async () => {
    const onGeocode = vi.fn();
    server.use(
      http.get(GEO_URL, () => {
        onGeocode();
        return HttpResponse.json([johorGeocoding]);
      }),
    );

    renderApp(<TodayWeather />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /search for weather/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(/enter a city/i);
    expect(onGeocode).not.toHaveBeenCalled();
  });

  it("recovers to a successful reading after a failed search", async () => {
    renderApp(<TodayWeather />);
    await search("Asdfgh, ZZ");
    await screen.findByText(/couldn't find/i);

    await search("Johor, MY");

    expect(await screen.findByText("26°")).toBeInTheDocument();
    expect(screen.queryByText(/couldn't find/i)).not.toBeInTheDocument();
  });

  it("keeps rendering when the reading has no condition data", async () => {
    server.use(
      http.get(WEATHER_URL, () =>
        HttpResponse.json({ ...johorWeather, weather: [] }),
      ),
    );
    renderApp(<TodayWeather />);
    await search("Johor, MY");

    expect(await screen.findByText("26°")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("Unknown")).toBeInTheDocument(),
    );
  });
});
