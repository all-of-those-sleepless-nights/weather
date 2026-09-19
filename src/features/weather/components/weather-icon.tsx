import { weatherIconFor } from "./weather-icon-map";

type WeatherIconProps = {
  iconCode: string;
  description: string;
  className?: string;
};

export function WeatherIcon({
  iconCode,
  description,
  className,
}: WeatherIconProps) {
  return (
    <img
      src={weatherIconFor(iconCode)}
      alt={description}
      width={240}
      height={240}
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
