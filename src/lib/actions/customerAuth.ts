"use server";

/**
 * src/lib/actions/customerAuth.ts
 * ─────────────────────────────────────────────────────────────
 * Public-facing auth actions — separate from src/lib/actions/auth.ts
 * (which is the /admin CMS login). These power /login and /signup
 * and always land the visitor on /account, never /admin.
 */

import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getURL } from "@/lib/utils/site-url";

type OAuthProvider = "google" | "azure";

// Same "collect cookies, write them before redirect()" trick used by the
// admin login action — required because redirect() inside a Server Action
// finalizes the response before any later cookie writes would land.
async function buildClientAndCookieWriter() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env vars");
  }

  const cookieStore = await cookies();
  const pending: { name: string; value: string; options: object }[] = [];

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          pending.push({ name, value, options });
        });
      },
    },
  });

  return {
    supabase,
    flush: () => {
      pending.forEach(({ name, value, options }) => {
        try {
          cookieStore.set(name, value, options as any);
        } catch {
          /* ignore */
        }
      });
    },
  };
}

/** Email + password registration. Sends a confirmation email (if your
 *  Supabase project has "Confirm email" enabled, which is the default). */
export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("name") ?? "").trim();

  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent("Email and password are required.")}`);
    return;
  }
  if (password.length < 8) {
    redirect(`/signup?error=${encodeURIComponent("Password must be at least 8 characters.")}`);
    return;
  }

  let supabase: ReturnType<typeof createServerClient>;
  let flush: () => void;

  try {
    const built = await buildClientAndCookieWriter();
    supabase = built.supabase;
    flush = built.flush;
  } catch {
    redirect(`/signup?error=${encodeURIComponent("Server isn't configured correctly. Contact support.")}`);
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
      emailRedirectTo: `${getURL()}auth/callback?next=/account`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    return;
  }

  flush();

  // If email confirmation is required, Supabase returns a user but no
  // session yet — send them to check their inbox instead of /account.
  if (data.user && !data.session) {
    redirect(
      `/login?message=${encodeURIComponent(
        "Almost there — check your inbox and click the confirmation link to finish creating your account."
      )}`
    );
    return;
  }

  redirect("/account");
}

/** Email + password sign in. */
export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/account");

  let supabase: ReturnType<typeof createServerClient>;
  let flush: () => void;

  try {
    const built = await buildClientAndCookieWriter();
    supabase = built.supabase;
    flush = built.flush;
  } catch {
    redirect(`/login?error=${encodeURIComponent("Server isn't configured correctly. Contact support.")}`);
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
    return;
  }

  flush();
  redirect(next.startsWith("/") ? next : "/account");
}

/** Kicks off the OAuth flow for Google or Microsoft (covers Gmail and
 *  Outlook/Hotmail/Microsoft 365 accounts — Supabase calls this provider
 *  "azure"). Redirects the browser to the provider's consent screen;
 *  the provider then bounces back to /auth/callback. */
export async function signInWithOAuth(formData: FormData) {
  const provider = String(formData.get("provider") ?? "") as OAuthProvider;
  const next = String(formData.get("next") ?? "/account");

  if (provider !== "google" && provider !== "azure") {
    redirect(`/login?error=${encodeURIComponent("Unsupported provider.")}`);
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    redirect(`/login?error=${encodeURIComponent("Server isn't configured correctly. Contact support.")}`);
    return;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options as any);
          } catch {
            /* ignore */
          }
        });
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getURL()}auth/callback?next=${encodeURIComponent(next)}`,
      ...(provider === "azure" ? { scopes: "email openid profile" } : {}),
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data?.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "Could not start sign-in.")}`);
    return;
  }

  redirect(data.url);
}

/** Signs the visitor out and returns them to the homepage. */
export async function signOutCustomer() {
  const built = await buildClientAndCookieWriter();
  await built.supabase.auth.signOut();
  built.flush();
  redirect("/");
}
