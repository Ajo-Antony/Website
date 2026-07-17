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

const makeMockClient = () => {
  const target = (() => {}) as any;
  const chainHandler = {
    get(target: any, prop: string): any {
      if (prop === "then") {
        return (resolve: any) => resolve({ data: null, error: null, count: 0 });
      }
      return new Proxy(target, chainHandler);
    },
    apply(target: any, thisArg: any, argumentsList: any[]) {
      return new Proxy(target, chainHandler);
    }
  };

  const clientHandler = {
    get(target: any, prop: string): any {
      if (prop === "then") {
        return undefined;
      }
      if (prop === "auth") {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        };
      }
      if (prop === "storage") {
        return {
          from: () => new Proxy(target, chainHandler),
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        };
      }
      return new Proxy(target, chainHandler);
    },
    apply(target: any, thisArg: any, argumentsList: any[]) {
      return new Proxy(target, chainHandler);
    }
  };

  return new Proxy(target, clientHandler);
};

export function createStaticClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. Using mock client fallback.");
    return makeMockClient();
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
