import type { SearchHistoryEntry } from "../model/types";
import { SearchHistoryItem } from "./search-history-item";

type SearchHistoryPanelProps = {
  entries: SearchHistoryEntry[];
  onSearch: (entry: SearchHistoryEntry) => void;
  onRemove: (id: string) => void;
};

/** The nested glass panel of past searches. */
export function SearchHistoryPanel({
  entries,
  onSearch,
  onRemove,
}: SearchHistoryPanelProps) {
  return (
    <section
      aria-labelledby="search-history-heading"
      className="mt-5 rounded-card border border-glass-border bg-surface-panel px-3 pb-3 pt-4 sm:mt-6 sm:px-4 sm:pb-4"
    >
      <h2
        id="search-history-heading"
        className="px-1 text-sm font-medium text-foreground sm:text-base"
      >
        Search History
      </h2>

      {entries.length === 0 ? (
        <p className="px-1 py-6 text-sm text-muted-foreground">
          Your recent searches will appear here.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {entries.map((entry) => (
            <SearchHistoryItem
              key={entry.id}
              entry={entry}
              onSearch={onSearch}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
