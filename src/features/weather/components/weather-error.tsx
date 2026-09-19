import { messageForError } from "../model/error-messages";

/**
 * The failure message, shown in the card's status line.
 *
 * Text only: the struck-through cloud already stands where the illustration
 * goes, and repeating it beside the sentence says the same thing twice.
 */
export function WeatherError({ error }: { error: unknown }) {
  return (
    <p className="text-sm text-destructive">{messageForError(error)}</p>
  );
}
