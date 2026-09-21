import { useCallback, useMemo, useState } from "react";
import { createLocalStorageSearchHistoryRepository } from "../repository/local-storage-search-history-repository";
import type { SearchHistoryRepository } from "../repository/search-history-repository";
import type { NewSearchHistoryEntry } from "../model/types";

/** React state over an injectable {@link SearchHistoryRepository}. */
export function useSearchHistory(repository?: SearchHistoryRepository) {
  const repo = useMemo(
    () => repository ?? createLocalStorageSearchHistoryRepository(),
    [repository],
  );

  const [entries, setEntries] = useState(() => repo.list());

  const add = useCallback(
    (entry: NewSearchHistoryEntry) => setEntries(repo.add(entry)),
    [repo],
  );

  const remove = useCallback(
    (id: string) => setEntries(repo.remove(id)),
    [repo],
  );

  const clear = useCallback(() => setEntries(repo.clear()), [repo]);

  return { entries, add, remove, clear };
}
