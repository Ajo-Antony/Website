/**
 * src/app/admin/section-designer/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Admin route: /admin/section-designer
 *
 * The visual Section Designer — lets the admin:
 *  1. Reorder page sections via drag-and-drop
 *  2. Toggle section visibility (hide/show)
 *  3. Design each section: bg colour/gradient/pattern/image,
 *     text colours, layout, marquee, slider, custom images
 * ─────────────────────────────────────────────────────────────
 */
import AdminShell from "@/components/pages/adminPage/AdminShell";
import SectionDesignerClient from "@/components/pages/adminPage/SectionDesigner/SectionDesignerClient";
import { getAllSectionDesigns } from "@/lib/actions/sectionDesigner";

export default async function SectionDesignerPage() {
  const sections = await getAllSectionDesigns();

  return (
    <AdminShell active="/admin/section-designer">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-ink mb-1">Section Designer</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Drag to reorder sections, toggle visibility, and customize colors, patterns,
          backgrounds, marquees, sliders and images for each section independently.
        </p>
      </div>
      <SectionDesignerClient initialSections={sections} />
    </AdminShell>
  );
}
