const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface WakeOptions {
  /** Total number of polling attempts once a cold start is detected. */
  maxAttempts?: number;
  /** Delay between polling attempts. */
  intervalMs?: number;
  /** Timeout for each individual ping. */
  perAttemptTimeoutMs?: number;
}

async function pingOnce(timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fire-and-forget wake ping. Call this on page mount so a sleeping
 * Render instance starts spinning up while the user is still
 * reading or pasting their log — well before they click submit.
 * Never throws, never blocks the UI.
 */
export function wakeBackendInBackground(): void {
  pingOnce(5000).catch(() => {});
}

/**
 * Blocking check used right before a real request. Tries once fast
 * (covers the common case where the backend is already warm, adding
 * zero perceived delay). If that fails, assumes a cold start and
 * polls at a fixed interval until the backend responds or the
 * attempt budget runs out.
 *
 * Returns true once the backend is confirmed awake, false if it
 * never responded within the budget (genuinely down, not just cold).
 *
 * @param onWaking optional callback fired exactly once, only if the
 * fast path fails — use it to switch your UI into a "waking up the
 * server..." state instead of a generic spinner.
 */
export async function ensureBackendAwake(
  onWaking?: () => void,
  options: WakeOptions = {}
): Promise<boolean> {
  const {
    maxAttempts = 20,
    intervalMs = 3000,
    perAttemptTimeoutMs = 4000,
  } = options;

  // Fast path: backend already warm — the overwhelmingly common case
  // once wakeBackendInBackground() has had a few seconds to run.
  if (await pingOnce(perAttemptTimeoutMs)) {
    return true;
  }

  // Slow path: likely a Render cold start (30-60s typical).
  onWaking?.();

  for (let attempt = 1; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));

    if (await pingOnce(perAttemptTimeoutMs)) {
      return true;
    }
  }

  return false;
}