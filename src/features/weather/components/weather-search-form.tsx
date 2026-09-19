import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Loader2, Search } from "lucide-react";
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
 * The floating search bar.
 *
 * A real form element, so Enter submits and assistive technology announces
 * the control as a search. The mockup labels the single field "Country"
 * while the brief asks for city and country, so one field takes both as
 * "City, Country" and the visible label says as much. The separator is
 * inserted by the input mask rather than typed — see `place-input-mask.ts`.
 *
 * The whole pill is the label, so clicking anywhere inside it focuses the
 * field rather than only the line the text sits on.
 */
export function WeatherSearchForm({
  onSearch,
  isSearching = false,
}: WeatherSearchFormProps) {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validatePlaceQuery(value);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError(null);
    onSearch(result.query);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-start gap-3"
    >
      <div className="min-w-0 flex-1">
        <label
          htmlFor={inputId}
          className="glass block cursor-text rounded-row border border-glass-border bg-surface-input px-4 py-2"
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
            aria-describedby={error ? errorId : undefined}
            className="w-full border-0 bg-transparent p-0 text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </label>

        {error ? (
          <p id={errorId} role="alert" className="mt-2 px-1 text-sm text-destructive">
            {error}
          </p>
        ) : null}
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
