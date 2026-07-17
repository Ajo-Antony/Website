import { createClient } from "@supabase/supabase-js";

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

// Add to .env.local:
// NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : makeMockClient();
