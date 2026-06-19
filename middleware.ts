import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

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

    // Use getUser() to verify the session server-side with Supabase Auth.
    // This prevents forged/expired JWTs from bypassing the guard.
    const { data: { user } } = await supabase.auth.getUser();

    // Not logged in → redirect to login
    if (isAdminRoute && !isLoginPage && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Already logged in → skip the login page
    if (isLoginPage && user) {
      const next = request.nextUrl.searchParams.get("next") ?? "/admin";
      const url = request.nextUrl.clone();
      url.pathname = next.startsWith("/admin") ? next : "/admin";
      url.searchParams.delete("next");
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
  // Match /admin AND all /admin/* sub-routes
  matcher: ["/admin", "/admin/:path*"],
};
