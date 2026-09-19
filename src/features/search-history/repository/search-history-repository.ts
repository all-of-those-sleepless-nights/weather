import type {
  NewSearchHistoryEntry,
  SearchHistoryEntry,
} from "../model/types";

/**
 * The port.
 *
 * The UI depends on this interface, never on a storage mechanism. Moving
 * history to a signed-in account means adding one adapter that implements
 * these four methods — no component changes.
 */
export interface SearchHistoryRepository {
  /** Most recent first. */
  list(): SearchHistoryEntry[];
  /** Adds, or moves an existing entry to the top with a fresh timestamp. */
  add(entry: NewSearchHistoryEntry): SearchHistoryEntry[];
  remove(id: string): SearchHistoryEntry[];
  clear(): SearchHistoryEntry[];
}

/** Repeat searches update the existing row rather than duplicating it. */
export function historyIdentity(entry: NewSearchHistoryEntry): string {
  return `${entry.city.toLowerCase()}|${(entry.countryCode ?? "").toLowerCase()}`;
}
