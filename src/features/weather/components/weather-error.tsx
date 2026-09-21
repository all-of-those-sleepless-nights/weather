import { messageForError } from "../model/error-messages";

export function WeatherError({ error }: { error: unknown }) {
  return (
    <p className="text-sm text-destructive">{messageForError(error)}</p>
  );
}
