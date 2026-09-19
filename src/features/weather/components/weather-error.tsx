import { CloudOff } from "lucide-react";
import { messageForError } from "../model/error-messages";

/**
 * The failure message, shown in the card's status line.
 *
 * It sits inside the same card as the reading, which is now showing a dash
 * for every value — so the message says what went wrong and the card itself
 * already says there is nothing to show.
 */
export function WeatherError({ error }: { error: unknown }) {
  return (
    <p className="flex items-start gap-2 text-sm text-muted-foreground">
      <CloudOff
        className="mt-0.5 size-4 shrink-0 text-destructive"
        aria-hidden="true"
      />
      <span>{messageForError(error)}</span>
    </p>
  );
}
