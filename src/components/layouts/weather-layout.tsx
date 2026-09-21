import type { ReactNode } from "react";
import bgLight from "@/assets/bg-light.jpg";
import bgDark from "@/assets/bg-dark.jpg";
import { useTheme } from "@/components/theme/use-theme";
import { ScrollToTopButton } from "./scroll-to-top";

export function WeatherLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-dvh w-full">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-[background-image] duration-500"
        style={{ backgroundImage: `url(${theme === "dark" ? bgDark : bgLight})` }}
      />

      <main className="mx-auto flex w-full max-w-175 flex-col gap-4 pb-16 pt-6 md:gap-8 px-4 max-md:px-7 md:pt-10">
        <h1 className="sr-only">Today&rsquo;s Weather</h1>
        {children}
      </main>

      <ScrollToTopButton />
    </div>
  );
}
