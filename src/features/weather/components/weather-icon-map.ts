import sunIcon from "@/assets/sun.png";
import cloudIcon from "@/assets/cloud.png";

/** Condition groups that still show some sun: clear, few and scattered cloud. */
const SUNNY_GROUPS = new Set(["01", "02", "03"]);

/**
 * What the card shows before a reading exists, and after one fails.
 *
 * The clear-sky code, so the placeholder is the sun-behind-cloud the mockup
 * pairs with the card — the empty state keeps the composition rather than
 * leaving a hole where the illustration belongs.
 */
export const PLACEHOLDER_ICON_CODE = "01d";

/**
 * Picks the closest of the two supplied illustrations for a condition.
 *
 * The design kit ships two icons while OpenWeather reports nine condition
 * groups. Skies with sun still showing use the sun-behind-cloud — which is
 * what the mockup pairs with "Clouds" — and everything from broken cloud
 * onwards, including rain, snow, thunderstorms and fog, uses the cloud.
 */
export function weatherIconFor(iconCode: string): string {
  return SUNNY_GROUPS.has(iconCode.slice(0, 2)) ? sunIcon : cloudIcon;
}
