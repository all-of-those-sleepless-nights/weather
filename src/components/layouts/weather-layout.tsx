import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useTheme } from "@/components/theme/use-theme";
import bgLight from "@/assets/bg-light.jpg";
import bgDark from "@/assets/bg-dark.jpg";

/**
 * Full-bleed photographic backdrop plus the page's landmark structure.
 *
 * The background sits on a fixed layer rather than on `body` so the glass
 * surfaces have something to blur against while the page scrolls.
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

      <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 pb-16 pt-5 sm:gap-10 sm:px-6 sm:pt-10">
        <h1 className="sr-only">Today&rsquo;s Weather</h1>

        {/* In flow on small screens, where a fixed corner would sit on top of
            the search button; pinned to the viewport corner from sm up. */}
        <div className="flex w-full justify-end sm:absolute sm:right-6 sm:top-6 sm:z-20 sm:w-auto">
          <ThemeToggle />
        </div>

        {children}
      </main>
    </div>
  );
}
