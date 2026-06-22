import type { Metadata } from "next";
import Link from "next/link";
import { signUpWithPassword } from "@/lib/actions/customerAuth";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "linear-gradient(165deg,#241c4d,#1a1333)" }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
        <div className="mb-1">
          <StrixmindWordmark theme="light" height={22} />
        </div>
        <p className="text-sm text-ink-soft mb-6">Create your StrixMind account.</p>

        {error && (
          <div className="mb-4 text-sm text-rose bg-rose/10 border border-rose/25 rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}

        <OAuthButtons next="/account" />

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs uppercase tracking-widest text-ink-dim">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form action={signUpWithPassword}>
          <label htmlFor="signup-name" className="block text-sm font-medium text-ink-soft mb-1">
            Full name
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            className="w-full mb-4 px-4 py-2.5 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />

          <label htmlFor="signup-email" className="block text-sm font-medium text-ink-soft mb-1">
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full mb-4 px-4 py-2.5 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />

          <label htmlFor="signup-password" className="block text-sm font-medium text-ink-soft mb-1">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full mb-1 px-4 py-2.5 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
          <p className="text-xs text-ink-dim mb-6">At least 8 characters.</p>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm py-3 rounded-lg shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity"
          >
            Create account
          </button>
        </form>

        <p className="text-xs text-ink-dim text-center mt-4">
          By continuing you agree to StrixMind&rsquo;s Terms of Service and Privacy Policy.
        </p>

        <p className="text-sm text-ink-soft text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
