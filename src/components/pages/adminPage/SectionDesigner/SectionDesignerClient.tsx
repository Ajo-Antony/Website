"use client";

/**
 * SectionDesignerClient.tsx
 * ─────────────────────────────────────────────────────────────
 * The main drag-and-drop section designer UI.
 * Uses the HTML5 Drag and Drop API (no extra deps).
 *
 * Features:
 *  - Drag to reorder sections within each page
 *  - Toggle visibility eye icon per section
 *  - Click section to open the full DesignPanel
 *  - Tab by page: Home, About, Services
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef, useTransition } from "react";
import type { SectionDesign, DesignSettings } from "@/lib/types/sectionDesigner";
import {
  toggleSectionVisibility,
  reorderSections,
  updateSectionDesign,
} from "@/lib/actions/sectionDesigner";
import DesignPanel from "./DesignPanel";

const PAGE_TABS = [
  { key: "home",     label: "🏠 Home" },
  { key: "about",    label: "👤 About" },
  { key: "services", label: "⚙️ Services" },
];

const PAGE_ICONS: Record<string, string> = {
  "home.hero":         "🦸",
  "home.trustedBy":    "🏢",
  "home.services":     "⚙️",
  "home.whyUs":        "✨",
  "home.workflow":     "🔄",
  "home.mission":      "🎯",
  "home.testimonials": "💬",
  "home.pricing":      "💰",
  "home.team":         "👥",
  "home.brand":        "🎨",
  "home.faq":          "❓",
  "home.cta":          "📣",
  "home.contact":      "📩",
  "about.hero":        "🦸",
  "about.story":       "📖",
  "about.values":      "💡",
  "about.team":        "👥",
  "services.hero":     "🦸",
  "services.list":     "📋",
  "services.cta":      "📣",
};

interface Props {
  initialSections: SectionDesign[];
}

export default function SectionDesignerClient({ initialSections }: Props) {
  const [sections, setSections] = useState<SectionDesign[]>(initialSections);
  const [activePage, setActivePage] = useState("home");
  const [editingSection, setEditingSection] = useState<SectionDesign | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Drag state
  const dragKey = useRef<string | null>(null);
  const dragOverKey = useRef<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const pageSections = sections
    .filter((s) => s.page === activePage)
    .sort((a, b) => a.sort_order - b.sort_order);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  // ── Visibility toggle ──────────────────────────────────────
  async function handleVisibilityToggle(section: SectionDesign) {
    const newVal = !section.is_visible;
    setSections((prev) =>
      prev.map((s) => (s.section_key === section.section_key ? { ...s, is_visible: newVal } : s))
    );
    setSaving(section.section_key);
    const { error } = await toggleSectionVisibility(section.section_key, newVal);
    setSaving(null);
    if (error) {
      setSections((prev) =>
        prev.map((s) => (s.section_key === section.section_key ? { ...s, is_visible: !newVal } : s))
      );
      showToast("❌ Failed to update visibility");
    } else {
      showToast(newVal ? "✅ Section visible" : "👁️ Section hidden");
    }
  }

  // ── Drag and drop ─────────────────────────────────────────
  function onDragStart(key: string) {
    dragKey.current = key;
    setDragging(key);
  }

  function onDragOver(e: React.DragEvent, key: string) {
    e.preventDefault();
    dragOverKey.current = key;
  }

  function onDrop() {
    if (!dragKey.current || !dragOverKey.current || dragKey.current === dragOverKey.current) {
      setDragging(null);
      return;
    }
    const pageKeys = [...pageSections].map((s) => s.section_key);
    const from = pageKeys.indexOf(dragKey.current);
    const to = pageKeys.indexOf(dragOverKey.current);
    if (from === -1 || to === -1) { setDragging(null); return; }

    // Reorder locally
    pageKeys.splice(from, 1);
    pageKeys.splice(to, 0, dragKey.current);

    setSections((prev) => {
      const updated = [...prev];
      pageKeys.forEach((key, idx) => {
        const i = updated.findIndex((s) => s.section_key === key);
        if (i !== -1) updated[i] = { ...updated[i], sort_order: idx + 1 };
      });
      return updated;
    });

    setDragging(null);
    startTransition(async () => {
      const { error } = await reorderSections(pageKeys);
      if (error) showToast("❌ Reorder failed");
      else showToast("✅ Order saved");
    });
  }

  // ── Design save ────────────────────────────────────────────
  async function handleDesignSave(sectionKey: string, design: DesignSettings) {
    setSections((prev) =>
      prev.map((s) => (s.section_key === sectionKey ? { ...s, design } : s))
    );
    const { error } = await updateSectionDesign(sectionKey, { design });
    if (error) {
      showToast("❌ Save failed: " + error);
    } else {
      showToast("✅ Design saved");
      setEditingSection((prev) => prev ? { ...prev, design } : null);
    }
  }

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-2xl transition-all">
          {toast}
        </div>
      )}

      {/* Page tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePage(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activePage === tab.key
                ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Section list */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-ink text-sm">Sections</div>
                <div className="text-xs text-gray-400 mt-0.5">Drag to reorder · Click to design</div>
              </div>
              <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                {pageSections.filter((s) => s.is_visible).length} / {pageSections.length} visible
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {pageSections.map((section) => {
                const isEditing = editingSection?.section_key === section.section_key;
                const isSaving = saving === section.section_key;
                const hasDesign = Object.keys(section.design).length > 0;

                return (
                  <div
                    key={section.section_key}
                    draggable
                    onDragStart={() => onDragStart(section.section_key)}
                    onDragOver={(e) => onDragOver(e, section.section_key)}
                    onDrop={onDrop}
                    onDragEnd={() => setDragging(null)}
                    className={`flex items-center gap-3 px-5 py-4 transition-all cursor-grab active:cursor-grabbing group ${
                      dragging === section.section_key
                        ? "opacity-40 bg-violet-50"
                        : dragOverKey.current === section.section_key && dragging
                        ? "bg-violet-50 border-l-2 border-violet-500"
                        : isEditing
                        ? "bg-violet-50"
                        : "hover:bg-gray-50"
                    } ${!section.is_visible ? "opacity-60" : ""}`}
                  >
                    {/* Drag handle */}
                    <div className="text-gray-300 group-hover:text-gray-400 transition-colors shrink-0 select-none">
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                        {[4, 9, 14].map((y) =>
                          [3, 9].map((x) => (
                            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="currentColor" />
                          ))
                        )}
                      </svg>
                    </div>

                    {/* Sort order badge */}
                    <div className="w-6 h-6 rounded-md bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                      {section.sort_order}
                    </div>

                    {/* Icon */}
                    <div className="text-lg shrink-0 select-none">
                      {PAGE_ICONS[section.section_key] ?? "📄"}
                    </div>

                    {/* Label + indicators */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isEditing ? "text-violet-700" : "text-ink"}`}>
                          {section.label}
                        </span>
                        {hasDesign && (
                          <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">
                            Styled
                          </span>
                        )}
                        {!section.is_visible && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{section.section_key}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Design button */}
                      <button
                        onClick={() => setEditingSection(isEditing ? null : section)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          isEditing
                            ? "bg-violet-600 text-white shadow"
                            : "bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700"
                        }`}
                      >
                        {isEditing ? "✏️ Editing" : "🎨 Design"}
                      </button>

                      {/* Visibility toggle */}
                      <button
                        onClick={() => handleVisibilityToggle(section)}
                        disabled={isSaving}
                        title={section.is_visible ? "Hide section" : "Show section"}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all text-base ${
                          section.is_visible
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        } ${isSaving ? "animate-pulse" : ""}`}
                      >
                        {section.is_visible ? "👁" : "🙈"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> Visible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" /> Hidden
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-violet-400 inline-block" /> Has custom design
            </span>
            <span>↕ Drag rows to reorder</span>
          </div>
        </div>

        {/* Design panel — slides in alongside list */}
        {editingSection && (
          <div className="w-[400px] shrink-0">
            <DesignPanel
              section={editingSection}
              onSave={handleDesignSave}
              onClose={() => setEditingSection(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
