import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLocalStorageSearchHistoryRepository,
  HISTORY_STORAGE_KEY,
} from "./local-storage-search-history-repository";

function makeRepository(limit?: number) {
  return createLocalStorageSearchHistoryRepository(window.localStorage, limit);
}

describe("localStorage search history repository", () => {
  beforeEach(() => window.localStorage.clear());

  it("starts empty and persists what is added", () => {
    const repo = makeRepository();
    expect(repo.list()).toEqual([]);

    repo.add({ city: "Johor", countryCode: "MY" });

    expect(makeRepository().list()).toHaveLength(1);
  });

  it("lists most recent first", () => {
    const repo = makeRepository();
    repo.add({ city: "Johor", countryCode: "MY" });
    repo.add({ city: "Osaka", countryCode: "JP" });

    expect(repo.list().map((entry) => entry.city)).toEqual(["Osaka", "Johor"]);
  });

  it("moves a repeated search to the top instead of duplicating it", () => {
    const repo = makeRepository();
    repo.add({ city: "Johor", countryCode: "MY" });
    repo.add({ city: "Osaka", countryCode: "JP" });
    repo.add({ city: "johor", countryCode: "my" });

    const entries = repo.list();
    expect(entries).toHaveLength(2);
    expect(entries[0].city).toBe("johor");
  });

  it("caps the list at the configured limit", () => {
    const repo = makeRepository(3);
    for (const city of ["A", "B", "C", "D"]) repo.add({ city });

    expect(repo.list().map((entry) => entry.city)).toEqual(["D", "C", "B"]);
  });

  it("removes a single entry by id", () => {
    const repo = makeRepository();
    repo.add({ city: "Johor", countryCode: "MY" });
    const [osaka] = repo.add({ city: "Osaka", countryCode: "JP" });

    repo.remove(osaka.id);

    expect(repo.list().map((entry) => entry.city)).toEqual(["Johor"]);
  });

  it("clears every entry", () => {
    const repo = makeRepository();
    repo.add({ city: "Johor" });
    repo.clear();

    expect(repo.list()).toEqual([]);
  });

  it("recovers from corrupt stored data rather than throwing", () => {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, "{not json");
    expect(makeRepository().list()).toEqual([]);

    window.localStorage.setItem(HISTORY_STORAGE_KEY, '{"shape":"wrong"}');
    expect(makeRepository().list()).toEqual([]);

    window.localStorage.setItem(HISTORY_STORAGE_KEY, '[{"city":"No id"}]');
    expect(makeRepository().list()).toEqual([]);
  });

  it("keeps working when storage rejects writes", () => {
    const failing: Storage = {
      ...window.localStorage,
      getItem: () => null,
      setItem: vi.fn(() => {
        throw new Error("QuotaExceededError");
      }),
    };
    const repo = createLocalStorageSearchHistoryRepository(failing);

    expect(() => repo.add({ city: "Johor" })).not.toThrow();
  });
});
