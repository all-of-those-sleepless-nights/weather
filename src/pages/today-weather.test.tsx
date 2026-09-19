import { describe, expect, it, vi } from "vitest";
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw-server";
import { GEO_URL, WEATHER_URL } from "@/test/handlers";
import { johorGeocoding, johorWeather } from "@/test/fixtures";
import { renderApp } from "@/test/render-app";
import TodayWeather from "./today-weather";

async function search(term: string) {
  const user = userEvent.setup();
  const field = screen.getByLabelText(/city, country/i);

  await user.clear(field);
  await user.type(field, term);
  await user.click(screen.getByRole("button", { name: /search for weather/i }));
  return user;
}

describe("Today's Weather", () => {
  it("shows a prompt before anything has been searched", () => {
    renderApp(<TodayWeather />);

    expect(screen.getByText(/search for a city/i)).toBeInTheDocument();
  });

  it("shows no readings at all until there is one", () => {
    renderApp(<TodayWeather />);

    expect(screen.queryByText(/^humidity/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^H:/)).not.toBeInTheDocument();
  });

  it("drops the reading when a search fails", async () => {
    renderApp(<TodayWeather />);
    await search("Johor, MY");
    await screen.findByText("26°");

    await search("Asdfgh, ZZ");

    expect(await screen.findByText(/couldn't find/i)).toBeInTheDocument();
    expect(screen.queryByText(/^humidity/i)).not.toBeInTheDocument();
  });

  it("clears the field with its clear button", async () => {
    renderApp(<TodayWeather />);
    const user = userEvent.setup();
    const field = screen.getByLabelText(/city, country/i);

    expect(
      screen.queryByRole("button", { name: /clear the search field/i }),
    ).not.toBeInTheDocument();

    await user.type(field, "Johor, MY");
    await user.click(
      screen.getByRole("button", { name: /clear the search field/i }),
    );

    expect(field).toHaveValue("");
    expect(field).toHaveFocus();
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

  it("takes the validation message down rather than leaving it up", async () => {
    renderApp(<TodayWeather />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /search for weather/i }),
    );

    const message = await screen.findByRole("alert");
    await waitForElementToBeRemoved(message, { timeout: 4000 });
  });

  it("recovers to a successful reading after a failed search", async () => {
    renderApp(<TodayWeather />);
    await search("Asdfgh, ZZ");
    await screen.findByText(/couldn't find/i);

    await search("Johor, MY");

    expect(await screen.findByText("26°")).toBeInTheDocument();
    expect(screen.queryByText(/couldn't find/i)).not.toBeInTheDocument();
  });

  it("accepts any separator character in place of a typed comma", async () => {
    renderApp(<TodayWeather />);
    await search("Johor/MY");

    expect(await screen.findByText("26°")).toBeInTheDocument();
  });

  it("ignores a second separator rather than building an unanswerable query", async () => {
    renderApp(<TodayWeather />);
    const user = userEvent.setup();
    const field = screen.getByLabelText(/city, country/i);
    await user.type(field, "Johor;MY;extra");

    expect(field).toHaveValue("Johor,MYextra");
  });

  it("keeps the previous reading on screen while the next one loads", async () => {
    renderApp(<TodayWeather />);
    await search("Johor, MY");
    await screen.findByText("26°");

    // Hold the second search open so the in-flight state can be inspected.
    let release = () => {};
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      http.get(GEO_URL, async () => {
        await held;
        return HttpResponse.json([{ ...johorGeocoding, name: "Ipoh" }]);
      }),
    );

    await search("Ipoh, MY");
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true"),
    );

    // The old reading stays put rather than emptying to placeholders.
    expect(screen.getByText("26°")).toBeInTheDocument();

    release();
    await waitFor(() => expect(screen.getByText("Ipoh, MY")).toBeInTheDocument());
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
