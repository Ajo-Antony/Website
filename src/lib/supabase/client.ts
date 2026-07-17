import { createBrowserClient } from "@supabase/ssr";

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

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return makeMockClient();
  }
  return createBrowserClient(url, key);
}
