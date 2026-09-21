import type { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { MotionProvider } from "@/components/motion/motion-provider";

/** A cache-isolated client per render. `retryDelay: 0` rather than
 *  `retry: false`: the hook owns the predicate, so retries still run. */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, retryDelay: 0, gcTime: 0 } },
  });
}

export function renderApp(ui: ReactElement) {
  const client = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}
