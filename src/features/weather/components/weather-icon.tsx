import { cn } from "cn";
import { Cloud, CloudOff } from "lucide-react";
import { IconSwap } from "@/components/motion/icon-swap";
import { weatherIconFor } from "./weather-icon-map";

type WeatherIconProps = {
  /** Omitted before a reading exists, or after one fails. */
  iconCode?: string;
  description?: string;
  /** Show the failure glyph rather than the neutral placeholder. */
  isError?: boolean;
  className?: string;
};

/**
 * How large the illustration is drawn. It lives here rather than at the call
 * site because the placeholder glyph has to be given the same size
 * explicitly: the swap wrapper centres its child instead of stretching it, so
 * an SVG asking for 100% has nothing to resolve against and collapses to its
 * intrinsic 24px. The image has no such problem — it carries its own
 * dimensions — but both need to end up the same size.
 */
const ICON_WIDTH = "w-32 sm:w-52 lg:w-60";
const GLYPH_SIZE = "size-32 sm:size-52 lg:size-60";

/**
 * The illustration overlapping the card.
 *
 * With a reading it is one of the two supplied images, keyed on the resolved
 * file rather than on the condition code — so moving between two conditions
 * that share an illustration, clear sky to few clouds, updates the
 * alternative text without a pointless animation.
 *
 * Without one it is a line glyph at the same size: a plain cloud while there
 * is nothing to show, the struck-through cloud when a lookup failed. Both are
 * decoration and carry no text alternative — the card's own message already
 * says what happened, and a screen reader should not hear it twice.
 */
export function WeatherIcon({
  iconCode,
  description,
  isError = false,
  className,
}: WeatherIconProps) {
  const box = cn(ICON_WIDTH, className);

  if (!iconCode) {
    const PlaceholderIcon = isError ? CloudOff : Cloud;

    return (
      <IconSwap
        swapKey={isError ? "error" : "empty"}
        variant="lift"
        className={box}
      >
        <PlaceholderIcon
          // A glyph drawn this large keeps its 24px viewBox, so the default
          // stroke would render an order of magnitude too heavy beside the
          // illustration it stands in for.
          strokeWidth={0.75}
          className={cn(
            GLYPH_SIZE,
            isError ? "text-destructive" : "text-foreground",
          )}
          aria-hidden="true"
        />
      </IconSwap>
    );
  }

  const source = weatherIconFor(iconCode);

  return (
    <IconSwap swapKey={source} variant="lift" className={box}>
      <img
        src={source}
        alt={description ?? ""}
        width={240}
        height={240}
        className="w-full"
        loading="eager"
        decoding="async"
      />
    </IconSwap>
  );
}
