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
  
  const nativePromise = Promise.resolve(promise);
  
  // Attach a catch handler directly to prevent Unhandled Promise Rejections
  // if the query fails or times out after the race has already finished.
  nativePromise.catch((err) => {
    console.error("Database query background rejection caught in withTimeout:", err);
  });

  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });

  try {
    return await Promise.race([nativePromise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}