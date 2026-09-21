import { cn } from "cn";
import { Cloud, CloudOff } from "lucide-react";
import { IconSwap } from "@/components/motion/icon-swap";
import { weatherIconFor } from "./weather-icon-map";

type WeatherIconProps = {
  iconCode?: string;
  description?: string;
  isError?: boolean;
  className?: string;
};

/* Sized by drawn ink, not the image box: the PNGs carry transparent margin. */
const IMAGE_WIDTH = "w-45 md:w-75";
const CLOUD_WIDTH = "w-35 md:w-52 box-content pr-7 narrow:pr-5";
const CLOUD_OFF_WIDTH = "w-25 md:w-44 box-content pr-16 narrow:pr-15";
const CLOUD_SIZE = "size-35 md:size-55";
const CLOUD_OFF_SIZE = "size-35 md:size-55";

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
        className={cn(
          isError ? CLOUD_OFF_WIDTH : CLOUD_WIDTH,
          className,
        )}
      >
        <PlaceholderIcon
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
        width={300}
        height={300}
        className="w-full"
        loading="eager"
        decoding="async"
      />
    </IconSwap>
  );
}
