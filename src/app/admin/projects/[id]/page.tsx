import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/pages/adminPage/AdminShell";
import ProjectForm from "@/components/pages/adminPage/ProjectForm";
import { updateProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/types/content";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).single();

  if (!data) notFound();

  const boundUpdate = updateProject.bind(null, id);

  return (
    <AdminShell active="/admin/projects">
      <h1 className="text-2xl font-extrabold text-ink mb-6">Edit project</h1>
      <ProjectForm project={data as Project} action={boundUpdate} />
    </AdminShell>
  );
}
