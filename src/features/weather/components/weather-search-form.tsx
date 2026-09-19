import { useId, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parsePlaceQuery } from "../model/parse-place-query";
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
 * while the brief asks for city and country, so the field takes both as
 * "City, Country" and the visible label says as much.
 */
export function WeatherSearchForm({
  onSearch,
  isSearching = false,
}: WeatherSearchFormProps) {
  const inputId = useId();
  const errorId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = parsePlaceQuery(value);

    if (!query) {
      setError("Enter a city, optionally followed by a country code.");
      return;
    }

    setError(null);
    onSearch(query);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-start gap-3"
    >
      <div className="min-w-0 flex-1">
        <div className="glass rounded-row border border-input-border bg-surface-input px-4 py-2">
          <label
            htmlFor={inputId}
            className="block text-[0.625rem] leading-tight text-muted-foreground"
          >
            City, Country
          </label>
          <input
            id={inputId}
            name="place"
            type="text"
            autoComplete="address-level2"
            placeholder="Singapore, SG"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error !== null}
            aria-describedby={error ? errorId : undefined}
            className="w-full border-0 bg-transparent p-0 text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </div>

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
        aria-label="Search for weather"
        className="size-[3.25rem] shrink-0 rounded-row bg-primary text-primary-foreground shadow-[var(--shadow-glass)] hover:bg-primary/90"
      >
        <Search className="size-5" aria-hidden="true" />
      </Button>
    </form>
  );
}
