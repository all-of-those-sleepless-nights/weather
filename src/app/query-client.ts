import { QueryClient } from "@tanstack/react-query";
import { isRetryable } from "@/lib/errors";

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
