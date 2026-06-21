import Link from "next/link";
import { signInWithPassword } from "@/lib/actions/customerAuth";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";

export const metadata = { title: "Sign in — StrixMind" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const { error, message, next } = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "linear-gradient(165deg,#241c4d,#1a1333)" }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
        <div className="mb-1">
          <StrixmindWordmark theme="light" height={22} />
        </div>
        <p className="text-sm text-ink-soft mb-6">Sign in to your StrixMind account.</p>

        {message && (
          <div className="mb-4 text-sm text-accent-deep bg-surface-alt border border-line rounded-lg px-3 py-2.5">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-rose bg-rose/10 border border-rose/25 rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}

        <OAuthButtons next={next ?? "/account"} />

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs uppercase tracking-widest text-ink-dim">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form action={signInWithPassword}>
          <input type="hidden" name="next" value={next ?? "/account"} />

          <label className="block text-sm font-medium text-ink-soft mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full mb-4 px-4 py-2.5 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />

          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-ink-soft">Password</label>
          </div>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full mb-6 px-4 py-2.5 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm py-3 rounded-lg shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </form>

        <p className="text-sm text-ink-soft text-center mt-6">
          Don&rsquo;t have an account?{" "}
          <Link href="/signup" className="text-accent font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
