import type {
  NewSearchHistoryEntry,
  SearchHistoryEntry,
} from "../model/types";

export interface SearchHistoryRepository {
  list(): SearchHistoryEntry[];
  add(entry: NewSearchHistoryEntry): SearchHistoryEntry[];
  remove(id: string): SearchHistoryEntry[];
  clear(): SearchHistoryEntry[];
}

export function historyIdentity(entry: NewSearchHistoryEntry): string {
  return `${entry.city.toLowerCase()}|${(entry.countryCode ?? "").toLowerCase()}`;
}
