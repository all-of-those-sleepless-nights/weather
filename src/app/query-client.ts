import { QueryClient } from "@tanstack/react-query";
import { isRetryable } from "@/lib/errors";

/**
 * Defaults chosen for a service that is slow-moving and occasionally flaky:
 * cache generously, retry only what a retry could actually fix.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => isRetryable(error) && failureCount < 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}
