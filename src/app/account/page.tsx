import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutCustomer } from "@/lib/actions/customerAuth";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";

export const metadata = { title: "Your account — StrixMind" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders — middleware already guards /account, but a
  // direct server-render check keeps this page safe even if the
  // middleware matcher is ever changed.
  if (!user) {
    redirect("/login?next=/account");
  }

  const provider = user!.app_metadata?.provider ?? "email";
  const name =
    (user!.user_metadata?.full_name as string | undefined) ||
    (user!.user_metadata?.name as string | undefined) ||
    user!.email;

  return (
    <div className="min-h-screen bg-surface-alt px-4 py-20">
      <div className="max-w-md mx-auto bg-[var(--surface)] rounded-2xl p-8 shadow-xl border border-line">
        <StrixmindWordmark theme="light" height={20} />

        <h1 className="text-xl font-bold text-ink mt-6 mb-1">Welcome, {name} 👋</h1>
        <p className="text-sm text-ink-soft mb-6">{user!.email}</p>

        <dl className="space-y-3 text-sm border-t border-line pt-4 mb-8">
          <div className="flex justify-between">
            <dt className="text-ink-dim">Signed in with</dt>
            <dd className="text-[var(--text)] font-medium capitalize">
              {provider === "azure" ? "Microsoft" : provider}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-dim">Account created</dt>
            <dd className="text-[var(--text)] font-medium">
              {user!.created_at ? new Date(user!.created_at).toLocaleDateString() : "—"}
            </dd>
          </div>
        </dl>

        <form action={signOutCustomer}>
          <button
            type="submit"
            className="w-full border border-line text-[var(--text)] font-medium text-sm py-2.5 rounded-lg hover:bg-surface-alt transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
