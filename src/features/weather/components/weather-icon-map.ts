import sunIcon from "@/assets/sun.png";
import cloudIcon from "@/assets/cloud.png";

const SUNNY_GROUPS = new Set(["01", "02", "03"]);

export function weatherIconFor(iconCode: string): string {
  return SUNNY_GROUPS.has(iconCode.slice(0, 2)) ? sunIcon : cloudIcon;
}
