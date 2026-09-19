import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw-server";
import { GEO_URL } from "@/test/handlers";
import { johorGeocoding } from "@/test/fixtures";
import { renderApp } from "@/test/render-app";
import TodayWeather from "@/pages/today-weather";

async function search(term: string) {
  const user = userEvent.setup();
  const field = screen.getByLabelText(/city, country/i);
  await user.clear(field);
  await user.type(field, term);
  await user.click(screen.getByRole("button", { name: /search for weather/i }));
  return user;
}

function historyList() {
  return within(
    screen.getByRole("region", { name: /search history/i }),
  ).queryAllByRole("listitem");
}

describe("search history", () => {
  it("starts with an empty state", () => {
    renderApp(<TodayWeather />);

    expect(screen.getByText(/recent searches will appear here/i)).toBeInTheDocument();
    expect(historyList()).toHaveLength(0);
  });

  it("records a search", async () => {
    renderApp(<TodayWeather />);
    await search("Johor, MY");

    await waitFor(() => expect(historyList()).toHaveLength(1));
    expect(historyList()[0]).toHaveTextContent("Johor, MY");
  });

  it("records a search that failed, so it can be retried", async () => {
    renderApp(<TodayWeather />);
    await search("Asdfgh, ZZ");

    await screen.findByText(/couldn't find/i);
    expect(historyList()[0]).toHaveTextContent("Asdfgh, ZZ");
  });

  it("moves a repeated search to the top rather than duplicating it", async () => {
    renderApp(<TodayWeather />);
    await search("Johor, MY");
    await waitFor(() => expect(historyList()).toHaveLength(1));
    await search("Osaka, JP");
    await waitFor(() => expect(historyList()).toHaveLength(2));
    await search("Johor, MY");

    await waitFor(() => expect(historyList()).toHaveLength(2));
    expect(historyList()[0]).toHaveTextContent("Johor, MY");
  });

  it("calls the API again when a row's search button is used", async () => {
    const onGeocode = vi.fn();
    server.use(
      http.get(GEO_URL, () => {
        onGeocode();
        return HttpResponse.json([johorGeocoding]);
      }),
    );

    renderApp(<TodayWeather />);
    const user = await search("Johor, MY");
    await screen.findByText("26°");
    const callsAfterFirstSearch = onGeocode.mock.calls.length;

    await user.click(
      screen.getByRole("button", { name: /search weather for johor, my again/i }),
    );

    await waitFor(() =>
      expect(onGeocode.mock.calls.length).toBeGreaterThan(callsAfterFirstSearch),
    );
  });

  it("removes a row with its delete button", async () => {
    renderApp(<TodayWeather />);
    const user = await search("Johor, MY");
    await waitFor(() => expect(historyList()).toHaveLength(1));

    await user.click(
      screen.getByRole("button", {
        name: /remove johor, my from search history/i,
      }),
    );

    await waitFor(() => expect(historyList()).toHaveLength(0));
    expect(screen.getByText(/recent searches will appear here/i)).toBeInTheDocument();
  });

  it("survives a reload", async () => {
    const { unmount } = renderApp(<TodayWeather />);
    await search("Johor, MY");
    await waitFor(() => expect(historyList()).toHaveLength(1));
    unmount();

    renderApp(<TodayWeather />);

    expect(historyList()).toHaveLength(1);
    expect(historyList()[0]).toHaveTextContent("Johor, MY");
  });
});
