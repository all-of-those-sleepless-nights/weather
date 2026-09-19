import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconSwap } from "@/components/motion/icon-swap";
import { maskPlaceInput } from "../model/place-input-mask";
import { validatePlaceQuery } from "../model/place-query";
import type { PlaceQuery } from "../model/types";

type WeatherSearchFormProps = {
  onSearch: (query: PlaceQuery) => void;
  isSearching?: boolean;
};

/**
 * How long a validation message stays up.
 *
 * It is a prompt to fix a keystroke, not a state of the page: once it has
 * been read it is in the way of the field it is pointing at. The id beside it
 * restarts the clock when the same message is raised again, so submitting an
 * empty field twice shows it twice.
 */
const ERROR_VISIBLE_MS = 2000;

type ValidationError = { id: number; message: string };

/**
 * The floating search bar.
 *
 * A real form element, so Enter submits and assistive technology announces
 * the control as a search. The mockup labels the single field "Country"
 * while the brief asks for city and country, so one field takes both as
 * "City, Country" and the visible label says as much. The separator is
 * inserted by the input mask rather than typed — see `place-input-mask.ts`.
 *
 * The whole pill is the label, so clicking anywhere inside it focuses the
 * field rather than only the line the text sits on. The clear button is a
 * sibling of the label rather than a child: a button nested inside a label
 * is invalid HTML, and a click on it would then also count as a click on the
 * label. It is positioned over the pill's padding instead.
 */
export function WeatherSearchForm({
  onSearch,
  isSearching = false,
}: WeatherSearchFormProps) {
  const inputId = useId();
  const messageId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<ValidationError | null>(null);
  const errorCount = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const errorId = error?.id;
  useEffect(() => {
    if (errorId === undefined) return;
    const timer = setTimeout(() => setError(null), ERROR_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [errorId]);

  /**
   * Masking rewrites what was typed, which would otherwise throw the caret to
   * the end on every keystroke. Because the mask is a left-to-right scan,
   * masking the text before the caret gives its new position exactly.
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const caret = maskPlaceInput(
      input.value.slice(0, input.selectionStart ?? input.value.length),
    ).length;
    const masked = maskPlaceInput(input.value);

    // Written straight to the DOM as well as to state: when the mask drops a
    // character the value is unchanged, React skips the re-render, and the
    // rejected keystroke would otherwise stay on screen.
    if (input.value !== masked) input.value = masked;
    input.setSelectionRange(caret, caret);

    setValue(masked);
    if (error) setError(null);
  }

  function handleClear() {
    setValue("");
    setError(null);
    // Clearing is the start of retyping, not the end of the interaction.
    inputRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validatePlaceQuery(value);

    if (!result.ok) {
      errorCount.current += 1;
      setError({ id: errorCount.current, message: result.message });
      return;
    }

    setError(null);
    onSearch(result.query);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex min-w-0 flex-1 items-start gap-3"
    >
      <div className="min-w-0 flex-1">
        <div className="relative">
          <label
            htmlFor={inputId}
            className="glass block cursor-text rounded-row border border-glass-border bg-surface-input py-2 pl-4 pr-12"
          >
            <span className="block text-[0.625rem] leading-tight text-muted-foreground">
              City, Country
            </span>
            <input
              ref={inputRef}
              id={inputId}
              name="place"
              type="text"
              autoComplete="address-level2"
              placeholder="Singapore, SG"
              value={value}
              onChange={handleChange}
              aria-invalid={error !== null}
              aria-describedby={error ? messageId : undefined}
              className="w-full border-0 bg-transparent p-0 text-base text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </label>

          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              aria-label="Clear the search field"
              // Centred with `my-auto` rather than a transform: the button's
              // own active state nudges translate-y, which would throw a
              // translate-centred button off the pill on every press.
              className="absolute inset-y-0 right-2 my-auto size-8 rounded-full text-muted-foreground hover:bg-surface-row hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {error ? (
            <m.p
              key={error.id}
              id={messageId}
              role="alert"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-2 px-1 text-sm text-destructive"
            >
              {error.message}
            </m.p>
          ) : null}
        </AnimatePresence>
      </div>

      <Button
        type="submit"
        size="icon-lg"
        disabled={isSearching}
        aria-busy={isSearching}
        aria-label="Search for weather"
        // The button dims while disabled, which would bury the spinner it is
        // disabled in order to show; the busy state opts back out of that.
        className="size-[3.25rem] shrink-0 rounded-row bg-primary text-primary-foreground shadow-[var(--shadow-glass)] hover:bg-primary/90 aria-busy:disabled:opacity-100"
      >
        <IconSwap swapKey={isSearching ? "busy" : "idle"} className="size-5">
          {isSearching ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="size-5" aria-hidden="true" />
          )}
        </IconSwap>
      </Button>
    </form>
  );
}
