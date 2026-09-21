import type { SearchHistoryEntry } from "../model/types";
import {
  historyIdentity,
  type SearchHistoryRepository,
} from "./search-history-repository";

export const HISTORY_STORAGE_KEY = "todays-weather.search-history.v1";

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
      return [];
    }
  }

  function write(entries: SearchHistoryEntry[]): SearchHistoryEntry[] {
    try {
      storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Quota or storage unavailable: degrade to in-memory for this session.
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
