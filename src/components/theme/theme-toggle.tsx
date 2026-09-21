import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconSwap } from "@/components/motion/icon-swap";
import { useTheme } from "./use-theme";

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
      className="glass size-12 md:size-15 shrink-0 rounded-row border border-glass-border bg-surface-input bg-clip-border text-foreground hover:bg-surface-row"
    >
      <IconSwap swapKey={theme} className="size-5 md:size-8.5">
        {theme === "dark" ? (
          <Sun className="size-5 md:size-8.5" aria-hidden="true" />
        ) : (
          <Moon className="size-5 md:size-8.5" aria-hidden="true" />
        )}
      </IconSwap>
    </Button>
  );
}
