import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Loader2, X } from "lucide-react";
import searchIcon from "@/assets/search-icon.svg";
import { Button } from "@/components/ui/button";
import { IconSwap } from "@/components/motion/icon-swap";
import { maskPlaceInput } from "../model/place-input-mask";
import { validatePlaceQuery } from "../model/place-query";
import type { PlaceQuery } from "../model/types";

type WeatherSearchFormProps = {
  onSearch: (query: PlaceQuery) => void;
  isSearching?: boolean;
};

const ERROR_VISIBLE_MS = 2000;

type ValidationError = { id: number; message: string };

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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const caret = maskPlaceInput(
      input.value.slice(0, input.selectionStart ?? input.value.length),
    ).length;
    const masked = maskPlaceInput(input.value);

    if (input.value !== masked) input.value = masked;
    input.setSelectionRange(caret, caret);

    setValue(masked);
    if (error) setError(null);
  }

  function handleClear() {
    setValue("");
    setError(null);
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
      className="flex min-w-0 flex-1 items-start gap-2 md:gap-4"
    >
      <div className="relative min-w-0 flex-1">
        <div className="relative">
          <label
            htmlFor={inputId}
            className="glass block cursor-text rounded-row border border-glass-border bg-surface-input pt-1.5 md:pt-2 pl-3 md:pl-5 md:pr-12 h-12 md:h-15"
          >
            <span className="block text-[0.6rem] md:text-[0.625rem] leading-tight text-muted-foreground">
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
              className="w-full border-0 bg-transparent p-0 text-sm md:text-base text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </label>

          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              aria-label="Clear the search field"
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
              className="absolute left-0 top-full z-20 mt-2 px-1 text-sm text-destructive"
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
        className="size-12 md:size-15 shrink-0 rounded-row bg-primary text-primary-foreground shadow-[var(--shadow-glass)] hover:bg-primary/90 aria-busy:disabled:opacity-100"
      >
        <IconSwap swapKey={isSearching ? "busy" : "idle"} className="size-5 md:size-8.5">
          {isSearching ? (
            <Loader2 className="size-5 md:size-8.5 animate-spin" aria-hidden="true" />
          ) : (
            <img src={searchIcon} alt="" className="size-5 md:size-8.5" />
          )}
        </IconSwap>
      </Button>
    </form>
  );
}
