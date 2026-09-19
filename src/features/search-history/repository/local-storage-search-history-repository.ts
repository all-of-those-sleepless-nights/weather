import type { SearchHistoryEntry } from "../model/types";
import {
  historyIdentity,
  type SearchHistoryRepository,
} from "./search-history-repository";

export const HISTORY_STORAGE_KEY = "todays-weather.search-history.v1";

/** Keeps the list useful and the stored payload small. */
export const HISTORY_LIMIT = 20;

function createId(): string {
  // randomUUID is unavailable on insecure origins and in older jsdom.
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function isEntry(value: unknown): value is SearchHistoryEntry {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.city === "string" &&
    typeof candidate.searchedAt === "string"
  );
}

/**
 * Browser-storage implementation of {@link SearchHistoryRepository}.
 *
 * Every read is defensive: storage is shared with the user, other tabs, and
 * previous versions of this app, so anything malformed is discarded rather
 * than allowed to crash the page on boot.
 */
export function createLocalStorageSearchHistoryRepository(
  storage: Storage = window.localStorage,
  limit: number = HISTORY_LIMIT,
): SearchHistoryRepository {
  function read(): SearchHistoryEntry[] {
    try {
      const raw = storage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isEntry);
    } catch {
      // Corrupt JSON, or storage blocked entirely (Safari private browsing).
      return [];
    }
  }

  function write(entries: SearchHistoryEntry[]): SearchHistoryEntry[] {
    try {
      storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Quota exceeded or storage unavailable. History is a convenience, so
      // degrade to in-memory for this session rather than failing the search.
    }
    return entries;
  }

  return {
    list: read,

    add(entry) {
      const identity = historyIdentity(entry);
      const withoutDuplicate = read().filter(
        (existing) => historyIdentity(existing) !== identity,
      );

      const created: SearchHistoryEntry = {
        id: createId(),
        city: entry.city,
        countryCode: entry.countryCode,
        searchedAt: new Date().toISOString(),
      };

      return write([created, ...withoutDuplicate].slice(0, limit));
    },

    remove(id) {
      return write(read().filter((entry) => entry.id !== id));
    },

    clear() {
      return write([]);
    },
  };
}
