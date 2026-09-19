import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconSwap } from "@/components/motion/icon-swap";
import { useTheme } from "./use-theme";

/**
 * Claims the brief's optional requirement: a switcher between both mockups.
 *
 * Built to the same square as the search button it sits beside, so the two
 * controls read as one strip — filled violet for the action that submits the
 * form, glass for the one that only changes how the page looks.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      className="glass size-[3.25rem] shrink-0 rounded-row border border-glass-border bg-surface-input text-foreground hover:bg-surface-row"
    >
      <IconSwap swapKey={theme} className="size-5">
        {theme === "dark" ? (
          <Sun className="size-5" aria-hidden="true" />
        ) : (
          <Moon className="size-5" aria-hidden="true" />
        )}
      </IconSwap>
    </Button>
  );
}
