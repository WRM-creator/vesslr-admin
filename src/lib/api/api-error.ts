/**
 * An error response from the API, thrown by the query and mutation wrappers in
 * `factory.ts`. The generated client hands back the parsed body (a plain
 * object), so `error instanceof Error ? error.message : …` never saw the
 * server's message. This makes it a real Error whose `message` is the body's,
 * and copies the body's fields onto it so readers of extra fields (e.g. a 409's
 * `shortfall`) keep working.
 */
export class ApiError extends Error {
  readonly body: unknown;
  readonly statusCode?: number;
  [field: string]: unknown;

  constructor(body: unknown) {
    super(messageOf(body));
    this.name = "ApiError";
    this.body = body;
    if (body && typeof body === "object") {
      for (const [key, value] of Object.entries(body)) {
        if (key !== "message" && key !== "name" && key !== "stack" && key !== "body") {
          (this as Record<string, unknown>)[key] = value;
        }
      }
    }
  }
}

function messageOf(body: unknown): string {
  if (typeof body === "string" && body.trim()) return body.trim();
  if (body && typeof body === "object") {
    const { message, error } = body as { message?: unknown; error?: unknown };
    if (Array.isArray(message)) {
      const parts = message.filter((m): m is string => typeof m === "string");
      if (parts.length) return parts.join("; ");
    }
    if (typeof message === "string" && message.trim()) return message;
    if (typeof error === "string" && error.trim()) return error;
  }
  return "Request failed";
}

/** Wrap an API error body; an existing Error passes through unchanged. */
export function toApiError(error: unknown): Error {
  return error instanceof Error ? error : new ApiError(error);
}
