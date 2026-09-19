import { IconSwap } from "@/components/motion/icon-swap";
import { weatherIconFor } from "./weather-icon-map";

type WeatherIconProps = {
  iconCode: string;
  description: string;
  className?: string;
};

/**
 * The illustration overlapping the card.
 *
 * Keyed on the resolved image rather than on the condition code, so moving
 * between two conditions that share an illustration — clear sky to few
 * clouds, say — updates the alternative text without a pointless animation.
 */
export function WeatherIcon({
  iconCode,
  description,
  className,
}: WeatherIconProps) {
  const source = weatherIconFor(iconCode);

  return (
    <IconSwap swapKey={source} variant="lift" className={className}>
      <img
        src={source}
        alt={description}
        width={240}
        height={240}
        className="w-full"
        loading="eager"
        decoding="async"
      />
    </IconSwap>
  );
}
