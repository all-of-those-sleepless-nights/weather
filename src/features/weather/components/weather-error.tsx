import { CloudOff } from "lucide-react";
import { messageForError } from "../model/error-messages";

export function WeatherError({ error }: { error: unknown }) {
  return (
    <div className="flex items-start gap-3">
      <CloudOff
        className="mt-0.5 size-5 shrink-0 text-destructive"
        aria-hidden="true"
      />
      <div>
        <h2 className="text-sm font-semibold text-foreground sm:text-base">
          No weather to show
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {messageForError(error)}
        </p>
      </div>
    </div>
  );
}
