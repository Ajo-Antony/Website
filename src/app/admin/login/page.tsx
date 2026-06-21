import { login } from "@/lib/actions/auth";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(165deg,#241c4d,#1a1333)" }}>
      <form action={login} className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
        <div className="mb-1">
          <StrixmindWordmark theme="light" height={22} />
        </div>
        <p className="text-sm text-ink-soft mb-6">Sign in to the content dashboard.</p>

        {error && (
          <div className="mb-4 text-sm text-rose bg-rose/10 border border-rose/25 rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-ink-soft mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full mb-4 px-4 py-2.5 border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />

        <label className="block text-sm font-medium text-ink-soft mb-1">Password</label>
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
    </div>
  );
}
