const PLACE_CHARACTER = /[\p{L}\p{M}\p{N} '’.-]/u;

export const PLACE_SEPARATOR = ",";

export function maskPlaceInput(value: string): string {
  let masked = "";
  let hasSeparator = false;

  for (const character of value) {
    if (PLACE_CHARACTER.test(character)) {
      masked += character;
      continue;
    }

    if (hasSeparator) continue;
    hasSeparator = true;
    masked += PLACE_SEPARATOR;
  }

  return masked;
}
