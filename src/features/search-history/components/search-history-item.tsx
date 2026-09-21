import searchIconLight from "@/assets/Search.png";
import searchIconDark from "@/assets/Search-dark.png";
import deleteIconLight from "@/assets/Delete.png";
import deleteIconDark from "@/assets/Delete-dark.png";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/use-theme";
import {
  formatPlace,
  formatTimestamp,
  viewerUtcOffsetSeconds,
} from "@/lib/format";
import type { SearchHistoryEntry } from "../model/types";

const ROW_ICONS = {
  light: { search: searchIconLight, remove: deleteIconLight },
  dark: { search: searchIconDark, remove: deleteIconDark },
} as const;

type SearchHistoryItemProps = {
  entry: SearchHistoryEntry;
  onSearch: (entry: SearchHistoryEntry) => void;
  /** Asks for removal; the panel confirms it before anything is deleted. */
  onRemove: (entry: SearchHistoryEntry) => void;
};

export function SearchHistoryItem({
  entry,
  onSearch,
  onRemove,
}: SearchHistoryItemProps) {
  const { theme } = useTheme();
  const icons = ROW_ICONS[theme];
  const label = entry.countryCode
    ? formatPlace(entry.city, entry.countryCode)
    : entry.city;
  const searchedAt = new Date(entry.searchedAt);

  return (
    <li className="flex items-center gap-3 narrow:flex-col narrow:items-stretch narrow:gap-2 rounded-row border border-glass-border bg-surface-row px-4.75 py-3.25">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:justify-between md:gap-4">
        <p className="truncate text-sm font-medium text-foreground md:text-base">
          {label}
        </p>
        <p className="text-[0.625rem] text-muted-foreground md:text-sm">
          <time dateTime={searchedAt.toISOString()}>
            {formatTimestamp(searchedAt, viewerUtcOffsetSeconds(searchedAt))}
          </time>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 narrow:justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSearch(entry)}
          aria-label={`Search weather for ${label} again`}
          className="size-9 md:size-8 rounded-full max-md:border-2 border border-control-border bg-surface-row text-foreground shadow-[var(--shadow-control)] hover:bg-surface-row"
        >
          <img src={icons.search} alt="" className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(entry)}
          aria-label={`Remove ${label} from search history`}
          className="size-9 md:size-8 rounded-full max-md:border-2 border border-control-border bg-surface-row text-foreground shadow-[var(--shadow-control)] hover:bg-surface-row"
        >
          <img src={icons.remove} alt="" className="size-4" />
        </Button>
      </div>
    </li>
  );
}
