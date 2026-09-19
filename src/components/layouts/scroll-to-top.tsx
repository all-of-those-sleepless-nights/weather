import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { scrollToTop } from "@/app/use-smooth-scroll";

/** How far down the page the button waits before offering itself. */
const REVEAL_AFTER_PX = 240;

/**
 * Returns the page to the top once the history list has taken it past a
 * screenful.
 *
 * Hidden until there is something to scroll back from, so it never covers the
 * card on a page that fits. It is the same glass square as the theme switch,
 * since it belongs to the same family of controls that act on the page rather
 * than on the weather.
 */
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > REVEAL_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const hidden = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.8, y: 8 };

  return (
    <AnimatePresence>
      {isVisible ? (
        <m.div
          initial={hidden}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={hidden}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-30 sm:bottom-8 sm:right-8"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="glass size-[3.25rem] rounded-row border border-glass-border bg-surface-input text-foreground hover:bg-surface-row"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </Button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
