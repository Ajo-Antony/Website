"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { FieldDef, SectionSchema, ContentValue } from "@/lib/cms/types";
import { updateContent, resetContent, uploadContentImage } from "@/lib/actions/content";
import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

const inputCls =
  "w-full px-3.5 py-2.5 border border-line rounded-xl text-sm text-ink bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors";
const labelCls = "block text-xs font-semibold text-ink-soft mb-1.5";

// ── Leaf field types ────────────────────────────────────────────────────
function TextField({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={labelCls}>{field.label}</label>
      <input className={inputCls} value={value ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextAreaField({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={labelCls}>{field.label}</label>
      <textarea
        className={inputCls}
        rows={field.rows ?? 3}
        value={value ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function BooleanField({ field, value, onChange }: { field: FieldDef; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft font-medium py-1.5">
      <input type="checkbox" className="w-4 h-4 accent-accent" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      {field.label}
    </label>
  );
}

function ImageField({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await uploadContentImage(fd);
      if (res.url) {
        onChange(res.url);
      } else {
        setError(res.error ?? "Upload failed. Please try again.");
      }
    } catch {
      // Network error, timeout, or expired session — the server action
      // threw instead of returning {error}. Without this catch, `busy`
      // would stay true forever and the button would be stuck on
      // "Uploading…" with no feedback.
      setError("Upload failed — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className={labelCls}>{field.label}</label>
      <div className="flex items-start gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-16 h-16 rounded-lg object-cover border border-line shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-lg border border-dashed border-line shrink-0 flex items-center justify-center text-ink-dim text-xs">none</div>
        )}
        <div className="flex-1 min-w-0">
          <input className={inputCls + " mb-2"} value={value ?? ""} placeholder="Image URL or upload below" onChange={(e) => onChange(e.target.value)} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line text-ink-soft hover:bg-surface-alt transition-colors disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line text-rose hover:bg-rose/10 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-rose mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ── String list (array of plain strings) ───────────────────────────────
function StringListField({ field, value, onChange }: { field: FieldDef; value: string[]; onChange: (v: string[]) => void }) {
  const items = value ?? [];
  return (
    <div>
      <label className={labelCls}>{field.label}</label>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls}
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="px-2.5 rounded-lg border border-line text-ink-dim hover:text-rose hover:border-rose/40 transition-colors flex items-center justify-center"
              style={{ minWidth: 36 }}
              aria-label="Remove"
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 text-xs font-semibold text-accent hover:text-accent-deep transition-colors"
      >
        + Add {field.itemLabel ?? "item"}
      </button>
    </div>
  );
}

// ── Array of objects (recursive) ────────────────────────────────────────
function emptyItem(itemFields: FieldDef[] = []): ContentValue {
  const obj: ContentValue = {};
  for (const f of itemFields) {
    if (f.type === "array" || f.type === "stringlist") obj[f.key] = [];
    else if (f.type === "boolean") obj[f.key] = false;
    else obj[f.key] = "";
  }
  return obj;
}

function ArrayField({ field, value, onChange }: { field: FieldDef; value: ContentValue[]; onChange: (v: ContentValue[]) => void }) {
  const items = value ?? [];
  const itemFields = field.itemFields ?? [];

  function updateItem(i: number, next: ContentValue) {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  }

  return (
    <div>
      <label className={labelCls}>{field.label}</label>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface-alt/50 p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-ink-dim">
                {field.itemLabel ?? "Item"} {i + 1}
              </span>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-xs px-2 py-1 rounded-md border border-line text-ink-soft hover:bg-white disabled:opacity-30 transition-colors">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-xs px-2 py-1 rounded-md border border-line text-ink-soft hover:bg-white disabled:opacity-30 transition-colors">↓</button>
                <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-xs px-2 py-1 rounded-md border border-line text-rose hover:bg-rose/10 transition-colors">Remove</button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {itemFields.map((sub) => (
                <FieldEditor
                  key={sub.key}
                  field={sub}
                  value={item[sub.key]}
                  onChange={(v) => updateItem(i, { ...item, [sub.key]: v })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, emptyItem(itemFields)])}
        className="mt-3 text-xs font-semibold text-accent hover:text-accent-deep transition-colors"
      >
        + Add {field.itemLabel ?? "item"}
      </button>
    </div>
  );
}

// ── Dispatcher ───────────────────────────────────────────────────────────
function FieldEditor({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "textarea":
      return <TextAreaField field={field} value={value as string} onChange={onChange as (v: string) => void} />;
    case "boolean":
      return <BooleanField field={field} value={value as boolean} onChange={onChange as (v: boolean) => void} />;
    case "image":
      return <ImageField field={field} value={value as string} onChange={onChange as (v: string) => void} />;
    case "stringlist":
      return <StringListField field={field} value={value as string[]} onChange={onChange as (v: string[]) => void} />;
    case "array":
      return <ArrayField field={field} value={value as ContentValue[]} onChange={onChange as (v: ContentValue[]) => void} />;
    default:
      return <TextField field={field} value={value as string} onChange={onChange as (v: string) => void} />;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────
/**
 * Ensure the initialValue is properly seeded with defaults.
 * If the DB returned an empty members array (or no members key at all),
 * we fall back to the defaults so the admin form always shows real data.
 */
function seedWithDefaults(schemaKey: string, value: ContentValue): ContentValue {
  const defaults = (CONTENT_DEFAULTS[schemaKey] ?? {}) as Record<string, unknown>;
  const seeded = { ...value } as Record<string, unknown>;

  for (const [k, defVal] of Object.entries(defaults)) {
    if (Array.isArray(defVal)) {
      const current = seeded[k];
      if (!Array.isArray(current) || current.length === 0) {
        // No saved array or empty array → use defaults
        seeded[k] = defVal;
      } else {
        // Saved array exists — but check if ALL items are blank
        const allBlank = (current as unknown[]).every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            Object.values(item as Record<string, unknown>).every(
              (v) => v === "" || v === null || v === undefined
            )
        );
        if (allBlank) seeded[k] = defVal;
      }
    } else if (seeded[k] === undefined) {
      seeded[k] = defVal;
    }
  }

  return seeded as ContentValue;
}

// ── Top-level form ───────────────────────────────────────────────────────
export default function ContentForm({ schema, initialValue }: { schema: SectionSchema; initialValue: ContentValue }) {
  // Seed with defaults so the form never shows blank data for existing defaults
  const [value, setValue] = useState<ContentValue>(() => seedWithDefaults(schema.key, initialValue));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  function set(key: string, v: unknown) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    const res = await updateContent(schema.key, value);
    setSaving(false);
    if (res.error) setStatus({ type: "error", text: res.error });
    else {
      setStatus({ type: "success", text: "Saved — live on the site now." });
      router.refresh();
    }
  }

  async function handleReset() {
    if (!confirm("Reset this section back to the default copy? Your edits will be lost.")) return;
    setSaving(true);
    await resetContent(schema.key);
    setSaving(false);
    // Re-seed from defaults after reset
    setValue(seedWithDefaults(schema.key, (CONTENT_DEFAULTS[schema.key] ?? {}) as ContentValue));
    router.refresh();
  }

  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-line p-6 sm:p-8 max-w-2xl">
      {status && (
        <div
          className={`mb-5 text-sm rounded-lg px-4 py-3 border ${
            status.type === "success" ? "bg-accent/8 border-accent/20 text-accent-deep" : "bg-rose/10 border-rose/25 text-rose"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="flex flex-col gap-5">
        {schema.fields.map((field) => (
          <FieldEditor key={field.key} field={field} value={value[field.key]} onChange={(v) => set(field.key, v)} />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-line">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="text-sm font-semibold text-ink-dim hover:text-rose transition-colors disabled:opacity-50"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}