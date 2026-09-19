import { useId, useRef, useState, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconSwap } from "@/components/motion/icon-swap";
import {
  validatePlaceQuery,
  type PlaceQueryErrors,
} from "../model/place-query";
import type { PlaceQuery } from "../model/types";

type WeatherSearchFormProps = {
  onSearch: (query: PlaceQuery) => void;
  isSearching?: boolean;
};

/**
 * The floating search bar.
 *
 * A real form element, so Enter submits and assistive technology announces
 * the control as a search. The mockup labels the single field "Country" while
 * the brief asks for city and country; the field is therefore split in two
 * with the separator printed between them, so the comma is part of the
 * furniture rather than something to remember to type. The two boxes share
 * one visible group label to keep the mockup's single-pill silhouette, and
 * each carries its own label for screen readers.
 */
export function WeatherSearchForm({
  onSearch,
  isSearching = false,
}: WeatherSearchFormProps) {
  const cityRef = useRef<HTMLInputElement>(null);
  const groupId = useId();
  const cityId = useId();
  const countryId = useId();
  const errorId = useId();

  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [errors, setErrors] = useState<PlaceQueryErrors>({});

  const messages = [errors.city, errors.countryCode].filter(Boolean);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validatePlaceQuery({ city, countryCode });

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSearch(result.query);
  }

  /** Clearing on edit stops a stale message contradicting what is typed. */
  function edit<T>(set: (value: T) => void) {
    return (value: T) => {
      set(value);
      if (messages.length > 0) setErrors({});
    };
  }

  const fieldClass =
    "min-w-0 border-0 bg-transparent p-0 text-base text-foreground outline-none placeholder:text-muted-foreground/70";

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-start gap-3"
    >
      <div className="min-w-0 flex-1">
        <div
          role="group"
          aria-labelledby={groupId}
          // Pointer affordance only: the rest of the pill is dead space that
          // people expect to click. Both fields remain reachable by label and
          // by keyboard without it.
          onClick={(event) => {
            if (event.target === event.currentTarget) cityRef.current?.focus();
          }}
          className="glass rounded-row border border-glass-border bg-surface-input px-4 py-2"
        >
          <span
            id={groupId}
            className="block text-[0.625rem] leading-tight text-muted-foreground"
          >
            City, Country
          </span>

          <div className="flex items-baseline">
            <label htmlFor={cityId} className="sr-only">
              City
            </label>
            {/* `field-sizing: content` grows the box with what is typed, so
                the separator sits against the city name instead of being
                pushed to the far edge by a flexible input. Where it is not
                supported the `size` attribute holds a sensible width and the
                layout still reads correctly. */}
            <input
              ref={cityRef}
              id={cityId}
              name="city"
              type="text"
              autoComplete="address-level2"
              placeholder="Singapore"
              size={12}
              value={city}
              onChange={(event) => edit(setCity)(event.target.value)}
              aria-invalid={errors.city !== undefined}
              aria-describedby={messages.length > 0 ? errorId : undefined}
              className={`${fieldClass} max-w-full field-sizing-content`}
            />

            <span aria-hidden="true" className="pr-1 text-base text-muted-foreground">
              ,
            </span>

            <label htmlFor={countryId} className="sr-only">
              Country code
            </label>
            <input
              id={countryId}
              name="countryCode"
              type="text"
              autoComplete="country"
              placeholder="SG"
              maxLength={2}
              size={2}
              value={countryCode}
              onChange={(event) => edit(setCountryCode)(event.target.value)}
              aria-invalid={errors.countryCode !== undefined}
              aria-describedby={messages.length > 0 ? errorId : undefined}
              className={`${fieldClass} w-7 shrink-0 uppercase`}
            />
          </div>
        </div>

        {messages.length > 0 ? (
          <p id={errorId} role="alert" className="mt-2 px-1 text-sm text-destructive">
            {messages.join(" ")}
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
