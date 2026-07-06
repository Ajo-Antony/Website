/**
 * withTimeout.ts
 * ─────────────────────────────────────────────────────────────
 * Races a promise against a timeout. Used to stop slow/hanging
 * Supabase calls on public pages from blocking the entire page's
 * TTFB — if the DB doesn't answer in time, callers fall back to
 * their built-in defaults instead of making the visitor wait (or
 * worse, timing out the whole request).
 *
 * IMPORTANT: this does not abort the underlying request — it just
 * stops *waiting* on it so the response can go out. The original
 * promise keeps running in the background and its result (or
 * rejection) is ignored once the timeout wins.
 * ─────────────────────────────────────────────────────────────
 */
export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  fallback: T
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    clearTimeout(timer!);
  }
}