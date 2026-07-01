"use client";

/**
 * SectionDesignerClient.tsx
 * ─────────────────────────────────────────────────────────────
 * The main drag-and-drop section designer UI.
 * Uses the HTML5 Drag and Drop API (no extra deps).
 *
 * Features:
 *  - Drag to reorder sections within each page
 *  - Toggle visibility per section
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
import {
  IconHome,
  IconUserCircle,
  IconGear,
  IconDragHandle,
  IconEyeOpen,
  IconEyeOff,
  IconPaletteSwatch,
  IconPencilEdit,
  IconSparkle,
  IconCheck,
  IconClose,
  IconArrowsUpDown,
  getSectionIcon,
} from "./icons";

const PAGE_TABS = [
  { key: "home",     label: "Home",     Icon: IconHome },
  { key: "about",    label: "About",    Icon: IconUserCircle },
  { key: "services", label: "Services", Icon: IconGear },
];

interface Props {
  initialSections: SectionDesign[];
}

export default function SectionDesignerClient({ initialSections }: Props) {
  const [sections, setSections] = useState<SectionDesign[]>(initialSections);
  const [activePage, setActivePage] = useState("home");
  const [editingSection, setEditingSection] = useState<SectionDesign | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; tone: "ok" | "error" } | null>(null);

  // Drag state
  const dragKey = useRef<string | null>(null);
  const dragOverKey = useRef<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const pageSections = sections
    .filter((s) => s.page === activePage)
    .sort((a, b) => a.sort_order - b.sort_order);

  function showToast(msg: string, tone: "ok" | "error" = "ok") {
    setToast({ msg, tone });
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
      showToast("Failed to update visibility", "error");
    } else {
      showToast(newVal ? "Section is now visible" : "Section hidden from site");
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
      if (error) showToast("Reorder failed", "error");
      else showToast("Order saved");
    });
  }

  // ── Design save ────────────────────────────────────────────
  async function handleDesignSave(sectionKey: string, design: DesignSettings) {
    setSections((prev) =>
      prev.map((s) => (s.section_key === sectionKey ? { ...s, design } : s))
    );
    const { error } = await updateSectionDesign(sectionKey, { design });
    if (error) {
      showToast("Save failed: " + error, "error");
    } else {
      showToast("Design saved");
      setEditingSection((prev) => prev ? { ...prev, design } : null);
    }
  }

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[var(--surface)] text-[var(--text)] text-sm font-medium pl-3 pr-4 py-2.5 rounded-xl shadow-[0_8px_30px_rgba(26,19,51,0.16)] border ${
            toast.tone === "error" ? "border-rose-200" : "border-line"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              toast.tone === "error" ? "bg-rose-50 text-rose-500" : "bg-accent/10 text-accent"
            }`}
          >
            {toast.tone === "error" ? <IconClose size={13} strokeWidth={2.4} /> : <IconCheck size={13} strokeWidth={2.4} />}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Page tabs — segmented control */}
      <div className="inline-flex items-center gap-1 mb-6 bg-surface-alt/70 border border-line rounded-xl p-1">
        {PAGE_TABS.map((tab) => {
          const active = activePage === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActivePage(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                active
                  ? "bg-white text-ink shadow-sm border border-line"
                  : "text-ink-soft hover:text-ink hover:bg-white/60 border border-transparent"
              }`}
            >
              <tab.Icon size={16} className={active ? "text-accent" : "text-ink-dim"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-6 items-start">
        {/* Section list */}
        <div className="flex-1 min-w-0">
          <div className="bg-[var(--surface)] rounded-2xl border border-line overflow-hidden">
            <div className="px-5 py-4 border-b border-line/70 flex items-center justify-between">
              <div>
                <div className="font-bold text-ink text-sm tracking-tight">Sections</div>
                <div className="text-xs text-ink-dim mt-0.5">Drag to reorder · Click to design</div>
              </div>
              <div className="text-xs text-ink-soft font-semibold bg-surface-alt border border-line px-3 py-1.5 rounded-lg tabular-nums">
                {pageSections.filter((s) => s.is_visible).length} / {pageSections.length} visible
              </div>
            </div>

            <div className="divide-y divide-line/70">
              {pageSections.map((section) => {
                const isEditing = editingSection?.section_key === section.section_key;
                const isSaving = saving === section.section_key;
                const hasDesign = Object.keys(section.design).length > 0;
                const SectionIcon = getSectionIcon(section.section_key);

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
                        ? "opacity-40 bg-accent/5"
                        : dragOverKey.current === section.section_key && dragging
                        ? "bg-accent/5 border-l-2 border-accent"
                        : isEditing
                        ? "bg-accent/[0.04]"
                        : "hover:bg-surface-alt/60"
                    } ${!section.is_visible ? "opacity-60" : ""}`}
                  >
                    {/* Drag handle */}
                    <div className="text-ink-dim/50 group-hover:text-ink-dim transition-colors shrink-0 select-none">
                      <IconDragHandle size={16} strokeWidth={1.5} />
                    </div>

                    {/* Sort order badge */}
                    <div className="w-6 h-6 rounded-full border border-line text-ink-dim text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                      {section.sort_order}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 select-none ${
                        section.is_visible ? "bg-accent/10 text-accent" : "bg-surface-alt text-ink-dim"
                      }`}
                    >
                      <SectionIcon size={17} strokeWidth={1.6} />
                    </div>

                    {/* Label + indicators */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isEditing ? "text-accent" : "text-ink"}`}>
                          {section.label}
                        </span>
                        {hasDesign && (
                          <span className="flex items-center gap-1 text-[11px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                            <IconSparkle size={10} strokeWidth={2} />
                            Styled
                          </span>
                        )}
                        {!section.is_visible && (
                          <span className="flex items-center gap-1 text-[11px] bg-surface-alt text-ink-dim px-2 py-0.5 rounded-full font-medium">
                            <IconEyeOff size={10} strokeWidth={2} />
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ink-dim font-mono mt-0.5">{section.section_key}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Design button */}
                      <button
                        onClick={() => setEditingSection(isEditing ? null : section)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border ${
                          isEditing
                            ? "bg-accent text-white border-accent shadow-sm"
                            : "bg-white text-ink-soft border-line hover:border-accent/40 hover:text-accent"
                        }`}
                      >
                        {isEditing ? <IconPencilEdit size={13} strokeWidth={2} /> : <IconPaletteSwatch size={13} strokeWidth={1.8} />}
                        {isEditing ? "Editing" : "Design"}
                      </button>

                      {/* Visibility toggle */}
                      <button
                        onClick={() => handleVisibilityToggle(section)}
                        disabled={isSaving}
                        title={section.is_visible ? "Hide section" : "Show section"}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                          section.is_visible
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                            : "bg-surface-alt text-ink-dim border-line hover:bg-line/40"
                        } ${isSaving ? "animate-pulse" : ""}`}
                      >
                        {section.is_visible ? <IconEyeOpen size={16} strokeWidth={1.7} /> : <IconEyeOff size={16} strokeWidth={1.7} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs text-ink-dim bg-surface-alt/50 border border-line/70 rounded-xl px-4 py-2.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Visible
            </span>
            <span className="w-px h-3 bg-line" />
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-dim/40 inline-block" /> Hidden
            </span>
            <span className="w-px h-3 bg-line" />
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Has custom design
            </span>
            <span className="w-px h-3 bg-line" />
            <span className="flex items-center gap-1.5">
              <IconArrowsUpDown size={12} strokeWidth={1.8} />
              Drag rows to reorder
            </span>
          </div>
        </div>

        {/* Design panel — slides in alongside list */}
        {editingSection && (
          <div className="w-[420px] shrink-0">
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
