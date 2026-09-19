import { IconSwap } from "@/components/motion/icon-swap";
import { PLACEHOLDER_ICON_CODE, weatherIconFor } from "./weather-icon-map";

type WeatherIconProps = {
  /** Omitted before a reading exists, or after one fails. */
  iconCode?: string;
  description?: string;
  className?: string;
};

/**
 * The illustration overlapping the card.
 *
 * Keyed on the resolved image rather than on the condition code, so moving
 * between two conditions that share an illustration — clear sky to few
 * clouds, say — updates the alternative text without a pointless animation.
 *
 * With no reading to describe it falls back to the default illustration at
 * the same size and carries an empty `alt`: there is no weather for it to
 * report, so it is decoration and a screen reader should skip it.
 */
export function WeatherIcon({
  iconCode,
  description,
  className,
}: WeatherIconProps) {
  const source = weatherIconFor(iconCode ?? PLACEHOLDER_ICON_CODE);

  return (
    <IconSwap swapKey={source} variant="lift" className={className}>
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
