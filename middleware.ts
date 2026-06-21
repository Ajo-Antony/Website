import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { pathname } = request.nextUrl;

  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  const isCustomerAuthPage = pathname === "/login" || pathname === "/signup";
  const isAccountRoute = pathname === "/account" || pathname.startsWith("/account/");

  // If env vars are missing: fail CLOSED for protected routes (admin +
  // account), fail OPEN for everything else (public auth pages just won't
  // be able to sign anyone in, but shouldn't 500 the whole site).
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[middleware] Missing Supabase env vars — blocking protected routes.");
    if (isAdminRoute && !isAdminLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    if (isAccountRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
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

    // Use getUser() to verify the session server-side with Supabase Auth.
    // This prevents forged/expired JWTs from bypassing the guard.
    const { data: { user } } = await supabase.auth.getUser();

    // ── Admin area ──────────────────────────────────────────────
    if (isAdminRoute && !isAdminLoginPage && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (isAdminLoginPage && user) {
      const next = request.nextUrl.searchParams.get("next") ?? "/admin";
      const url = request.nextUrl.clone();
      url.pathname = next.startsWith("/admin") ? next : "/admin";
      url.searchParams.delete("next");
      return NextResponse.redirect(url);
    }

    // ── Customer account area ───────────────────────────────────
    if (isAccountRoute && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Already logged in → skip /login and /signup, go straight to /account
    if (isCustomerAuthPage && user) {
      const next = request.nextUrl.searchParams.get("next") ?? "/account";
      const url = request.nextUrl.clone();
      url.pathname = next.startsWith("/") ? next : "/account";
      url.searchParams.delete("next");
      return NextResponse.redirect(url);
    }

    return response;
  } catch (err) {
    // Any unexpected error → fail CLOSED for protected routes only.
    console.error("[middleware] Auth check failed:", err);
    if (isAdminRoute && !isAdminLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    if (isAccountRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }
}

export const config = {
  // Match /admin, /account, /login, /signup and all their sub-routes
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*", "/login", "/signup"],
};
