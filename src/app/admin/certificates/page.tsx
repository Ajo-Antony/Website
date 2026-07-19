import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import CertificatesClient from "@/components/pages/adminPage/CertificatesClient";
import { getCertificateTemplate, getCertificateStudents } from "@/lib/actions/certificates";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const supabase = await createClient();

  // Double-guarded auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Load template and students list
  const [template, students] = await Promise.all([
    getCertificateTemplate(),
    getCertificateStudents(),
  ]);

  return (
    <AdminShell active="/admin/certificates">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink mb-1">Certificates Center</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Manage, generate, and edit student internship certificates. Customize branding styles and signatory parameters in real-time.
        </p>
      </div>

      <CertificatesClient initialTemplate={template} initialStudents={students} />
    </AdminShell>
  );
}
