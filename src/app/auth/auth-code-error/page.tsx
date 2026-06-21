import Link from "next/link";

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(165deg,#241c4d,#1a1333)" }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl text-center">
        <h1 className="text-lg font-bold text-ink mb-2">Sign-in didn&rsquo;t go through</h1>
        <p className="text-sm text-ink-soft mb-6">
          {message || "That link is invalid or has expired. Please try signing in again."}
        </p>
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm py-3 rounded-lg shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
