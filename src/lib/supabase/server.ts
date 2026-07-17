import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. Using mock client fallback.");
    return makeMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component during render — safe to ignore,
          // the middleware refreshes the session on the next request.
        }
      },
    },
  });
}
