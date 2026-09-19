/**
 * Characters that legitimately appear in a place name: letters in any script,
 * the combining marks that go with them, spaces for multi-word names, and the
 * hyphen, apostrophe and full stop that turn up in "Stratford-upon-Avon",
 * "L'Aquila" and "St. Louis".
 */
const PLACE_CHARACTER = /[\p{L}\p{M} '’.-]/u;

export const PLACE_SEPARATOR = ",";

/**
 * Rewrites what was typed into `City, Country` as it is typed.
 *
 * Anything that cannot be part of a place name becomes the separator, so the
 * comma never has to be typed deliberately — and only the first one survives,
 * because a place has one country. Typing a second separator does nothing
 * rather than silently producing a query no geocoder can answer.
 *
 * Left-to-right and stateful, which is what lets the caller work out where
 * the caret should land: masking a prefix of the input always yields the
 * matching prefix of the masked result.
 */
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
