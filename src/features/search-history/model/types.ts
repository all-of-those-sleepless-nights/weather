export type SearchHistoryEntry = {
  id: string;
  city: string;
  countryCode?: string;
  /** ISO 8601, so the stored form survives JSON round-tripping. */
  searchedAt: string;
};

export type NewSearchHistoryEntry = Pick<
  SearchHistoryEntry,
  "city" | "countryCode"
>;
