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
 * How large each form of the illustration is drawn.
 *
 * The three boxes differ because the artwork inside them does. Measured on
 * the supplied PNG, the solid cloud fills 87 % of the file's width and 72 %
 * of its height — the rest is transparent margin and the glow baked into the
 * image — so a glyph given the image's box renders half as big again and
 * crowds the card. Each glyph is therefore sized so that its *ink* matches
 * the illustration's: the struck-through cloud is smaller still, because its
 * diagonal reaches both corners while the plain cloud sits in the middle.
 *
 * They are also why the sizes live here rather than at the call site: the
 * swap wrapper centres its child instead of stretching it, so an SVG asking
 * for 100 % has nothing to resolve against and collapses to its intrinsic
 * 24px. Each glyph has to be given its size outright.
 */
const IMAGE_WIDTH = "w-32 sm:w-52 lg:w-60";
const CLOUD_WIDTH = "w-28 sm:w-44 lg:w-52";
const CLOUD_OFF_WIDTH = "w-24 sm:w-36 lg:w-44";
const CLOUD_SIZE = "size-28 sm:size-44 lg:size-52";
const CLOUD_OFF_SIZE = "size-24 sm:size-36 lg:size-44";

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
  if (!iconCode) {
    const PlaceholderIcon = isError ? CloudOff : Cloud;

    return (
      <IconSwap
        swapKey={isError ? "error" : "empty"}
        variant="lift"
        className={cn(isError ? CLOUD_OFF_WIDTH : CLOUD_WIDTH, className)}
      >
        <PlaceholderIcon
          // A glyph drawn this large keeps its 24px viewBox, so the default
          // stroke would render an order of magnitude too heavy beside the
          // illustration it stands in for.
          strokeWidth={0.75}
          className={cn(
            isError ? CLOUD_OFF_SIZE : CLOUD_SIZE,
            isError ? "text-destructive" : "text-foreground",
          )}
          aria-hidden="true"
        />
      </IconSwap>
    );
  }

  const source = weatherIconFor(iconCode);

  return (
    <IconSwap
      swapKey={source}
      variant="lift"
      className={cn(IMAGE_WIDTH, className)}
    >
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
