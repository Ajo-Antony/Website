/**
 * src/lib/supabase/staticClient.ts
 *
 * A plain, cookie-free Supabase client for PUBLIC, cacheable reads
 * (e.g. site_content). Unlike `@/lib/supabase/server`, this never calls
 * `cookies()` from `next/headers`, which means it's safe to use inside
 * `unstable_cache()` — the cookie-bound SSR client is NOT safe there,
 * because Next.js forbids dynamic APIs like `cookies()` inside a cached
 * function and will throw at runtime.
 *
 * Use this for anonymous/public data reads only (never for anything
 * that needs the current user's auth session).
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createStaticClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. " +
        "Set them in your Vercel project's Environment Variables (Project Settings → Environment Variables) and redeploy."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
