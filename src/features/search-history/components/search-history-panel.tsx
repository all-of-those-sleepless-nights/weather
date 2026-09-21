import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatPlace } from "@/lib/format";
import type { SearchHistoryEntry } from "../model/types";
import { SearchHistoryItem } from "./search-history-item";

type SearchHistoryPanelProps = {
  entries: SearchHistoryEntry[];
  onSearch: (entry: SearchHistoryEntry) => void;
  onRemove: (id: string) => void;
};

export function SearchHistoryPanel({
  entries,
  onSearch,
  onRemove,
}: SearchHistoryPanelProps) {
  const [pendingRemoval, setPendingRemoval] = useState<SearchHistoryEntry | null>(
    null,
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasConfirmed = useRef(false);

  const pendingLabel = pendingRemoval
    ? pendingRemoval.countryCode
      ? formatPlace(pendingRemoval.city, pendingRemoval.countryCode)
      : pendingRemoval.city
    : "";

  const confirmRemoval = () => {
    if (!pendingRemoval) return;
    wasConfirmed.current = true;
    onRemove(pendingRemoval.id);
    setPendingRemoval(null);
  };

  return (
    <section
      aria-labelledby="search-history-heading"
      className="mt-5 rounded-card border border-glass-border bg-surface-panel px-4 pb-4 pt-5 md:mt-6 md:px-5 md:pb-5"
    >
      <h2
        id="search-history-heading"
        ref={headingRef}
        tabIndex={-1}
        className="px-1 text-sm font-medium text-foreground outline-none md:text-base"
      >
        Search History
      </h2>

      {entries.length === 0 ? (
        <p className="px-1 py-6 text-base text-center text-muted-foreground">
          Your recent searches will appear here.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3 md:gap-5">
          {entries.map((entry) => (
            <SearchHistoryItem
              key={entry.id}
              entry={entry}
              onSearch={onSearch}
              onRemove={setPendingRemoval}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => {
          if (!open) setPendingRemoval(null);
        }}
        title="Delete this search?"
        description={
          <>
            <strong className="font-medium text-foreground">
              {pendingLabel}
            </strong>{" "}
            will be removed from your search history. This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        onConfirm={confirmRemoval}
        finalFocus={() => {
          const confirmed = wasConfirmed.current;
          wasConfirmed.current = false;
          return confirmed ? headingRef.current : true;
        }}
      />
    </section>
  );
}
