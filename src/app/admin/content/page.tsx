import Link from "next/link";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import { getGroupedSchemas } from "@/lib/cms/registry";

export default function AdminContentIndexPage() {
  const groups = getGroupedSchemas();
  const order = ["Global", "Home", "About", "Services", "Contact", "Booking", "Work"];

  return (
    <AdminShell active="/admin/content">
      <h1 className="text-2xl font-extrabold text-ink mb-1">Site Content</h1>
      <p className="text-sm text-ink-soft mb-8">
        Edit every text block, list, and image shown on the public site. Changes go live immediately — no redeploy needed.
      </p>

      <div className="flex flex-col gap-10">
        {order.filter((g) => groups[g]).map((group) => (
          <div key={group}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-dim mb-3">{group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups[group].map((s) => (
                <Link
                  key={s.key}
                  href={`/admin/content/${s.key}`}
                  className="bg-white rounded-2xl border border-line p-5 hover:border-accent/40 hover:shadow-[0_12px_32px_rgba(108,99,255,0.12)] transition-all"
                >
                  <div className="font-bold text-ink mb-1">{s.label}</div>
                  {s.description && <p className="text-xs text-ink-soft leading-relaxed">{s.description}</p>}
                  <div className="mt-3 text-xs font-semibold text-accent">Edit →</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
