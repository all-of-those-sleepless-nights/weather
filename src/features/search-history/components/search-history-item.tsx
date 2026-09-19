import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatPlace,
  formatTimestamp,
  viewerUtcOffsetSeconds,
} from "@/lib/format";
import type { SearchHistoryEntry } from "../model/types";

type SearchHistoryItemProps = {
  entry: SearchHistoryEntry;
  onSearch: (entry: SearchHistoryEntry) => void;
  onRemove: (id: string) => void;
};

export function SearchHistoryItem({
  entry,
  onSearch,
  onRemove,
}: SearchHistoryItemProps) {
  const label = entry.countryCode
    ? formatPlace(entry.city, entry.countryCode)
    : entry.city;
  const searchedAt = new Date(entry.searchedAt);

  return (
    <li className="flex items-center gap-3 rounded-row border border-glass-border bg-surface-row px-4 py-3">
      {/* Stacked on mobile, spread across the row on desktop. */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="truncate text-sm font-medium text-foreground sm:text-base">
          {label}
        </p>
        <p className="text-xs text-muted-foreground sm:text-sm">
          <time dateTime={searchedAt.toISOString()}>
            {formatTimestamp(searchedAt, viewerUtcOffsetSeconds(searchedAt))}
          </time>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSearch(entry)}
          aria-label={`Search weather for ${label} again`}
          className="size-9 rounded-full border border-glass-border bg-surface-row text-foreground hover:bg-surface-row"
        >
          <Search className="size-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(entry.id)}
          aria-label={`Remove ${label} from search history`}
          className="size-9 rounded-full border border-glass-border bg-surface-row text-foreground hover:bg-surface-row"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
