/**
 * Presentation formatting. `Intl` covers everything needed here, so no date
 * library is pulled in — and switching locale later is a parameter change
 * rather than a rewrite.
 */

/**
 * Formats as `01-09-2022 09:41am`, matching the mockup.
 *
 * An observation is shown in the *searched city's* local time, not the
 * viewer's: "09:41am in Johor" is the useful fact, and it should not change
 * depending on who is looking. The offset is applied to the instant and the
 * result formatted as UTC, which also keeps the output independent of the
 * machine the code runs on.
 */
export function formatTimestamp(
  date: Date,
  utcOffsetSeconds = 0,
  locale = "en-GB",
): string {
  const shifted = new Date(date.getTime() + utcOffsetSeconds * 1000);

  const datePart = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(shifted)
    .replace(/\//g, "-");

  const timePart = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(shifted)
    .toLowerCase()
    .replace(/\s/g, "");

  return `${datePart} ${timePart}`;
}

/**
 * The viewer's own offset from UTC, in seconds.
 *
 * Search history records when *this person* searched, so those timestamps
 * belong in their timezone — unlike an observation, which belongs in the
 * observed city's.
 */
export function viewerUtcOffsetSeconds(date: Date): number {
  return -date.getTimezoneOffset() * 60;
}

/** Rounds to whole degrees and appends the degree sign, e.g. `26°`. */
export function formatTemperature(celsius: number): string {
  return `${Math.round(celsius)}°`;
}

/** `Johor, MY` */
export function formatPlace(city: string, countryCode: string): string {
  return `${city}, ${countryCode}`;
}
