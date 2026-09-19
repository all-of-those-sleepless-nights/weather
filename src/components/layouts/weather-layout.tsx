import type { ReactNode } from "react";
import bgLight from "@/assets/bg-light.jpg";
import bgDark from "@/assets/bg-dark.jpg";
import { useTheme } from "@/components/theme/use-theme";
import { ScrollToTopButton } from "./scroll-to-top";

/**
 * Full-bleed photographic backdrop plus the page's landmark structure.
 *
 * The background sits on a fixed layer rather than on `body` so the glass
 * surfaces have something to blur against while the page scrolls. The page
 * itself grows with its content — a long history scrolls the document rather
 * than a panel inside the card — and the button in the corner brings the
 * reading back into view.
 */
export function WeatherLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-dvh w-full">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-[background-image] duration-500"
        style={{ backgroundImage: `url(${theme === "dark" ? bgDark : bgLight})` }}
      />

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pb-24 pt-5 sm:gap-8 sm:px-6 sm:pb-28 sm:pt-10">
        <h1 className="sr-only">Today&rsquo;s Weather</h1>
        {children}
      </main>

      <ScrollToTopButton />
    </div>
  );
}
