import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import { router } from "@/components/routes/router";
import { createQueryClient } from "@/app/query-client";
import { useSmoothScroll } from "@/app/use-smooth-scroll";

function App() {
  // Per app instance, not module scope, so tests get a clean cache.
  const [queryClient] = useState(createQueryClient);

  useSmoothScroll();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MotionProvider>
          <RouterProvider router={router} />
        </MotionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
