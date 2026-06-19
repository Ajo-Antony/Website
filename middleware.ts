import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  // If env vars are missing, block all admin routes (fail closed)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[middleware] Missing Supabase env vars — blocking admin access.");
    if (isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // getSession() reads the JWT from the cookie — no network round-trip.
    // This is intentional for middleware: fast, works on Vercel Edge, and
    // sufficient to gate access (the session cookie is HttpOnly + signed).
    // Individual server components use getUser() to verify with Supabase
    // when they need a guaranteed-fresh identity check.
    const { data: { session } } = await supabase.auth.getSession();

    // Not logged in → redirect to login
    if (isAdminRoute && !isLoginPage && !session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      // Preserve the intended destination so we can redirect after login
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Already logged in → skip the login page
    if (isLoginPage && session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return response;
  } catch (err) {
    // Any unexpected error → fail CLOSED: block admin, allow login page
    console.error("[middleware] Auth check failed:", err);
    if (isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};