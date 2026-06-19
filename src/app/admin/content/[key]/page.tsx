import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import ContentForm from "@/components/admin/ContentForm";
import { getSchema } from "@/lib/cms/registry";
import { getContent } from "@/lib/actions/content";

export default async function AdminContentEditPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const schema = getSchema(key);
  if (!schema) notFound();

  const value = await getContent(key);

  return (
    <AdminShell active="/admin/content">
      <Link href="/admin/content" className="text-xs font-semibold text-ink-dim hover:text-accent transition-colors">← All content</Link>
      <h1 className="text-2xl font-extrabold text-ink mt-2 mb-1">{schema.label}</h1>
      {schema.description && <p className="text-sm text-ink-soft mb-8">{schema.description}</p>}
      {!schema.description && <div className="mb-6" />}
      <ContentForm schema={schema} initialValue={value} />
    </AdminShell>
  );
}
