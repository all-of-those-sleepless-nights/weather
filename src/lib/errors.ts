/** The UI and the retry policy branch on these, never on HTTP status. */
export abstract class AppError extends Error {
  abstract readonly kind: string;
}

/** The place the user typed does not exist. Terminal: retrying cannot help. */
export class InvalidPlaceError extends AppError {
  readonly kind = "invalid-place";
  readonly query: string;
  constructor(query: string) {
    super(`No place matched "${query}".`);
    this.name = "InvalidPlaceError";
    this.query = query;
  }
}

/** The API key is missing, wrong, or not yet activated. Terminal. */
export class UnauthorizedError extends AppError {
  readonly kind = "unauthorized";
  constructor() {
    super("The weather service rejected our API key.");
    this.name = "UnauthorizedError";
  }
}

/** Too many calls. Worth retrying, but slowly. */
export class RateLimitError extends AppError {
  readonly kind = "rate-limit";
  constructor() {
    super("Too many requests to the weather service.");
    this.name = "RateLimitError";
  }
}

/** Offline, DNS failure, timeout. Worth retrying. */
export class NetworkError extends AppError {
  readonly kind = "network";
  override readonly cause?: unknown;
  constructor(cause?: unknown) {
    super("Could not reach the weather service.");
    this.name = "NetworkError";
    this.cause = cause;
  }
}

/** Anything else, including 5xx. Worth retrying. */
export class UnknownApiError extends AppError {
  readonly kind = "unknown";
  readonly status?: number;
  constructor(status?: number) {
    super("The weather service returned an unexpected response.");
    this.name = "UnknownApiError";
    this.status = status;
  }
}

/** Only failures that might resolve on their own are worth a second go. */
export function isRetryable(error: unknown): boolean {
  return error instanceof NetworkError || error instanceof UnknownApiError;
}
