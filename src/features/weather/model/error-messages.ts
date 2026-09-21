import {
  InvalidPlaceError,
  NetworkError,
  RateLimitError,
  UnauthorizedError,
} from "@/lib/errors";
import { MissingConfigError } from "@/lib/env";

export function messageForError(error: unknown): string {
  if (error instanceof InvalidPlaceError) {
    return `We couldn't find ${error.query}. Check the spelling, or try "City, CC" — for example "Johor, MY".`;
  }
  if (error instanceof MissingConfigError) return error.message;
  if (error instanceof UnauthorizedError) {
    return "The weather service rejected your API key. Check VITE_OPENWEATHER_API_KEY — a new key can take a few minutes to activate.";
  }
  if (error instanceof RateLimitError) {
    return "Too many searches in a short time. Wait a moment and try again.";
  }
  if (error instanceof NetworkError) {
    return "We couldn't reach the weather service. Check your connection and try again.";
  }
  return "Something went wrong fetching the weather. Please try again.";
}
