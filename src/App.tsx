import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { router } from "@/components/routes/router";
import { createQueryClient } from "@/app/query-client";
import { useSmoothScroll } from "@/app/use-smooth-scroll";

function App() {
  // Created once per app instance rather than at module scope, so tests get a
  // clean cache per render.
  const [queryClient] = useState(createQueryClient);

  useSmoothScroll();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
