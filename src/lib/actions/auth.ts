"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// We build the Supabase client directly here (rather than via createClient())
// so we can collect the cookies Supabase wants to set and write them into the
// response BEFORE the redirect.  If we used createClient() the cookie store is
// already "frozen" by the time redirect() runs and the session never lands in
// the browser.
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
        // Collect the cookies Supabase wants to write
        cookiesToSet.forEach(({ name, value, options }) => {
          pending.push({ name, value, options });
        });
      },
    },
  });

  return { supabase, flush: () => {
    // Write them into the Next.js cookie store (this works inside a Server Action)
    pending.forEach(({ name, value, options }) => {
      try { cookieStore.set(name, value, options as any); } catch { /* ignore */ }
    });
  }};
}

export async function login(formData: FormData) {
  const email    = String(formData.get("email")    ?? "");
  const password = String(formData.get("password") ?? "");

  let supabase: ReturnType<typeof createServerClient>;
  let flush: () => void;

  try {
    const built = await buildClientAndCookieWriter();
    supabase = built.supabase;
    flush    = built.flush;
  } catch {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "Server isn't configured correctly (missing Supabase environment variables). Contact the site admin."
      )}`
    );
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
    return;
  }

  // Write the session cookies BEFORE redirecting so the browser receives them
  flush();

  redirect("/admin");
}

export async function logout() {
  const built = await buildClientAndCookieWriter();
  await built.supabase.auth.signOut();
  built.flush();
  redirect("/admin/login");
}