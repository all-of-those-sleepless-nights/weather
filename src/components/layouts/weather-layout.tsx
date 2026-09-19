import type { ReactNode } from "react";
import { useTheme } from "@/components/theme/use-theme";
import bgLight from "@/assets/bg-light.jpg";
import bgDark from "@/assets/bg-dark.jpg";

/**
 * Full-bleed photographic backdrop plus the page's landmark structure.
 *
 * The composition fills the viewport exactly and the page itself never
 * scrolls: the search row and the reading take the height they need, and the
 * history list absorbs whatever is left over and scrolls inside its own
 * panel. That keeps the card anchored while the list grows.
 */
export function WeatherLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-[background-image] duration-500"
        style={{ backgroundImage: `url(${theme === "dark" ? bgDark : bgLight})` }}
      />

      <main className="mx-auto flex h-full w-full max-w-2xl flex-col gap-4 px-4 pb-5 pt-5 sm:gap-8 sm:px-6 sm:pb-8 sm:pt-10">
        <h1 className="sr-only">Today&rsquo;s Weather</h1>
        {children}
      </main>
    </div>
  );
}
