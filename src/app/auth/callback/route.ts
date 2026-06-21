/**
 * src/app/auth/callback/route.ts
 * ─────────────────────────────────────────────────────────────
 * Every auth flow that leaves the site (Google, Microsoft, and the
 * link inside the email-confirmation message) comes back here with
 * a one-time `code`. We exchange it for a real session, then send
 * the visitor on to wherever they were headed (`next`, default
 * /account).
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";
  const safeNext = next.startsWith("/") ? next : "/account";

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
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
                /* ignore — handled by middleware refresh */
              }
            });
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }

      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?message=${encodeURIComponent(error.message)}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
