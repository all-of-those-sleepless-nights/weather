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
