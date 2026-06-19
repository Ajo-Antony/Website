import AdminShell from "@/components/pages/adminPage/AdminShell";
import ProjectForm from "@/components/pages/adminPage/ProjectForm";
import { createProject } from "@/lib/actions/projects";

export default function NewProjectPage() {
  return (
    <AdminShell active="/admin/projects">
      <h1 className="text-2xl font-extrabold text-ink mb-6">New project</h1>
      <ProjectForm action={createProject} />
    </AdminShell>
  );
}
