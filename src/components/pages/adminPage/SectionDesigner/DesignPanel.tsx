"use client";

/**
 * DesignPanel.tsx
 * ─────────────────────────────────────────────────────────────
 * The full design control panel for a single section.
 *
 * Tabs:
 *  1. Background — solid / gradient / pattern / image
 *  2. Typography — text colour, heading colour, accent, alignment
 *  3. Layout     — width, padding, border, rounded corners
 *  4. Marquee    — enable, speed, direction
 *  5. Slider     — enable, type, autoplay, interval
 *  6. Images     — upload/manage images attached to this section
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef } from "react";
import type { SectionDesign, DesignSettings, BackgroundType, PatternType } from "@/lib/types/sectionDesigner";
import { uploadSectionImage, resetSectionDesign } from "@/lib/actions/sectionDesigner";

const PATTERNS: { key: PatternType; label: string; preview: string }[] = [
  { key: "dots",       label: "Dots",        preview: "radial-gradient(circle, #6c63ff22 1.5px, transparent 1.5px)" },
  { key: "grid",       label: "Grid",        preview: "linear-gradient(#6c63ff22 1px, transparent 1px), linear-gradient(90deg, #6c63ff22 1px, transparent 1px)" },
  { key: "diagonal",   label: "Diagonal",    preview: "repeating-linear-gradient(45deg, #6c63ff22 0, #6c63ff22 1px, transparent 0, transparent 50%)" },
  { key: "zigzag",     label: "Zigzag",      preview: "repeating-linear-gradient(135deg, #6c63ff22 0, #6c63ff22 2px, transparent 0, transparent 10px)" },
  { key: "waves",      label: "Waves",       preview: "repeating-radial-gradient(ellipse at 0% 50%, transparent 0%, transparent 45%, #6c63ff22 50%, transparent 55%)" },
  { key: "hexagon",    label: "Hexagon",     preview: "radial-gradient(circle farthest-side at 0% 50%, #6c63ff22 24%, transparent 0) calc(8px*1) calc(8px*1), radial-gradient(circle farthest-side at 0% 50%, transparent 24%, #6c63ff22 25%, #6c63ff22 36%, transparent 37%) 0 0" },
  { key: "crosshatch", label: "Crosshatch",  preview: "repeating-linear-gradient(45deg, #6c63ff22 0, #6c63ff22 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #6c63ff22 0, #6c63ff22 1px, transparent 0, transparent 50%)" },
  { key: "circles",    label: "Circles",     preview: "radial-gradient(circle at 50% 50%, transparent 30%, #6c63ff22 30%, #6c63ff22 32%, transparent 32%)" },
];

const PRESET_COLORS = [
  "#ffffff", "#f9fafb", "#f3f4f6", "#1a1333",
  "#6c63ff", "#4c46c4", "#0D9488", "#7C3AED",
  "#111827", "#374151", "#e5e7eb", "#fef3c7",
  "#ecfdf5", "#fdf2f8", "#eff6ff", "#fef9c3",
];

const GRADIENT_PRESETS = [
  { from: "#1a1333", to: "#241c4d",  label: "Dark Purple" },
  { from: "#6c63ff", to: "#4c46c4",  label: "Violet" },
  { from: "#0D9488", to: "#6c63ff",  label: "Teal → Violet" },
  { from: "#1a1333", to: "#0D9488",  label: "Dark → Teal" },
  { from: "#f7f6fd", to: "#eef0fb",  label: "Light" },
  { from: "#ffffff", to: "#f3f4f6",  label: "White → Gray" },
  { from: "#fdf2f8", to: "#eff6ff",  label: "Pink → Blue" },
  { from: "#ecfdf5", to: "#d1fae5",  label: "Green Mist" },
];

const PANEL_TABS = [
  { key: "bg",    label: "Background", icon: "🎨" },
  { key: "text",  label: "Typography", icon: "✍️" },
  { key: "layout",label: "Layout",     icon: "📐" },
  { key: "marquee",label:"Marquee",    icon: "📢" },
  { key: "slider",label: "Slider",     icon: "🎠" },
  { key: "images",label: "Images",     icon: "🖼️" },
];

interface Props {
  section: SectionDesign;
  onSave: (key: string, design: DesignSettings) => Promise<void>;
  onClose: () => void;
}

export default function DesignPanel({ section, onSave, onClose }: Props) {
  const [design, setDesign] = useState<DesignSettings>({ ...section.design });
  const [tab, setTab] = useState("bg");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof DesignSettings>(key: K, value: DesignSettings[K]) {
    setDesign((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(section.section_key, design);
    setSaving(false);
  }

  async function handleReset() {
    if (!confirm("Reset this section's design to defaults?")) return;
    setDesign({});
    await onSave(section.section_key, {});
    await resetSectionDesign(section.section_key);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const { url, error } = await uploadSectionImage(fd);
    setUploading(false);
    if (error || !url) return;
    const newImg = { id: Date.now().toString(), url, alt: "", position: "background" as const };
    set("images", [...(design.images ?? []), newImg]);
  }

  function removeImage(id: string) {
    set("images", (design.images ?? []).filter((img) => img.id !== id));
  }

  // ── Color picker ───────────────────────────────────────────
  function ColorPicker({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
    return (
      <div>
        <label className="block text-xs text-gray-500 font-medium mb-1.5">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#ffffff"
            className="flex-1 text-xs font-mono border border-gray-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-violet-400"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onChange(c)}
              title={c}
              style={{ background: c, border: value === c ? "2px solid #6c63ff" : "1.5px solid #e5e7eb" }}
              className="w-5 h-5 rounded-md transition-transform hover:scale-110"
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Sections ───────────────────────────────────────────────
  function renderBgTab() {
    const bgType = design.bgType ?? "solid";
    return (
      <div className="space-y-5">
        {/* Type selector */}
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-2">Background type</label>
          <div className="grid grid-cols-4 gap-2">
            {(["solid", "gradient", "pattern", "image"] as BackgroundType[]).map((t) => (
              <button
                key={t}
                onClick={() => set("bgType", t)}
                className={`text-xs py-2 rounded-lg font-semibold capitalize transition-all border ${
                  bgType === t
                    ? "bg-violet-600 text-white border-violet-600 shadow"
                    : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Solid */}
        {bgType === "solid" && (
          <ColorPicker label="Background colour" value={design.bgColor} onChange={(v) => set("bgColor", v)} />
        )}

        {/* Gradient */}
        {bgType === "gradient" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-2">Gradient presets</label>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENT_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      set("bgGradientFrom", p.from);
                      set("bgGradientTo", p.to);
                    }}
                    title={p.label}
                    style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                    className="h-9 rounded-lg border-2 border-transparent hover:border-violet-400 transition-all"
                  />
                ))}
              </div>
            </div>
            <ColorPicker label="From colour" value={design.bgGradientFrom} onChange={(v) => set("bgGradientFrom", v)} />
            <ColorPicker label="To colour"   value={design.bgGradientTo}   onChange={(v) => set("bgGradientTo", v)} />
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Direction</label>
              <select
                value={design.bgGradientDir ?? "to bottom"}
                onChange={(e) => set("bgGradientDir", e.target.value as any)}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-violet-400"
              >
                {["to bottom","to right","to bottom right","to bottom left","135deg","45deg"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Pattern */}
        {bgType === "pattern" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-2">Pattern style</label>
              <div className="grid grid-cols-4 gap-2">
                {PATTERNS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => set("bgPattern", p.key)}
                    title={p.label}
                    style={{
                      backgroundImage: p.preview,
                      backgroundSize: "16px 16px",
                      backgroundColor: "#f9fafb",
                      border: design.bgPattern === p.key ? "2px solid #6c63ff" : "2px solid #e5e7eb",
                    }}
                    className="h-12 rounded-lg transition-all hover:border-violet-300 flex items-end justify-center pb-1"
                  >
                    <span className="text-[9px] bg-white/80 px-1 rounded font-medium text-gray-600">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <ColorPicker label="Pattern colour" value={design.bgPatternColor} onChange={(v) => set("bgPatternColor", v)} />
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">
                Pattern opacity: {Math.round((design.bgPatternOpacity ?? 0.15) * 100)}%
              </label>
              <input
                type="range" min={0} max={1} step={0.05}
                value={design.bgPatternOpacity ?? 0.15}
                onChange={(e) => set("bgPatternOpacity", parseFloat(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
            <ColorPicker label="Base background colour" value={design.bgColor} onChange={(v) => set("bgColor", v)} />
          </div>
        )}

        {/* Image */}
        {bgType === "image" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Image URL</label>
              <input
                type="url"
                value={design.bgImage ?? ""}
                onChange={(e) => set("bgImage", e.target.value)}
                placeholder="https://... or upload below"
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-violet-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Or upload image</label>
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg text-xs text-violet-700 font-semibold hover:bg-violet-100 transition-colors">
                📎 Choose file
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  const fd = new FormData();
                  fd.append("file", file);
                  uploadSectionImage(fd).then(({ url }) => {
                    setUploading(false);
                    if (url) { set("bgImage", url); set("bgType", "image"); }
                  });
                }} />
              </label>
              {uploading && <div className="text-xs text-violet-500 animate-pulse mt-1">Uploading…</div>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">
                Image opacity: {Math.round((design.bgImageOpacity ?? 1) * 100)}%
              </label>
              <input
                type="range" min={0} max={1} step={0.05}
                value={design.bgImageOpacity ?? 1}
                onChange={(e) => set("bgImageOpacity", parseFloat(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
          </div>
        )}

        {/* Live preview */}
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1.5">Preview</label>
          <div
            className="h-20 rounded-xl border border-gray-200 relative overflow-hidden"
            style={buildBgStyle(design)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ color: design.textColor ?? "#1a1333" }} className="text-sm font-bold opacity-80">
                {section.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderTextTab() {
    return (
      <div className="space-y-5">
        <ColorPicker label="Text colour"    value={design.textColor}    onChange={(v) => set("textColor", v)} />
        <ColorPicker label="Heading colour" value={design.headingColor} onChange={(v) => set("headingColor", v)} />
        <ColorPicker label="Accent colour"  value={design.accentColor}  onChange={(v) => set("accentColor", v)} />
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-2">Text alignment</label>
          <div className="flex gap-2">
            {(["left","center","right"] as const).map((a) => (
              <button key={a}
                onClick={() => set("textAlign", a)}
                className={`flex-1 py-2 text-xs rounded-lg font-semibold capitalize border transition-all ${
                  (design.textAlign ?? "left") === a
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                }`}>
                {a === "left" ? "⬅ Left" : a === "center" ? "↔ Center" : "Right ➡"}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderLayoutTab() {
    return (
      <div className="space-y-5">
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-2">Section width</label>
          <div className="grid grid-cols-2 gap-2">
            {(["full","wide","contained","narrow"] as const).map((w) => (
              <button key={w}
                onClick={() => set("sectionWidth", w)}
                className={`py-2 text-xs rounded-lg font-semibold capitalize border transition-all ${
                  (design.sectionWidth ?? "contained") === w
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                }`}>
                {w}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1.5">
            Padding top: {design.paddingTop ?? 5}rem
          </label>
          <input type="range" min={0} max={20} step={0.5}
            value={design.paddingTop ?? 5}
            onChange={(e) => set("paddingTop", parseFloat(e.target.value))}
            className="w-full accent-violet-600"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1.5">
            Padding bottom: {design.paddingBottom ?? 5}rem
          </label>
          <input type="range" min={0} max={20} step={0.5}
            value={design.paddingBottom ?? 5}
            onChange={(e) => set("paddingBottom", parseFloat(e.target.value))}
            className="w-full accent-violet-600"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={design.borderTop ?? false}
              onChange={(e) => set("borderTop", e.target.checked)}
              className="w-4 h-4 rounded accent-violet-600"
            />
            <span className="text-xs font-medium text-gray-700">Top border</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={design.borderBottom ?? false}
              onChange={(e) => set("borderBottom", e.target.checked)}
              className="w-4 h-4 rounded accent-violet-600"
            />
            <span className="text-xs font-medium text-gray-700">Bottom border</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={design.roundedCorners ?? false}
              onChange={(e) => set("roundedCorners", e.target.checked)}
              className="w-4 h-4 rounded accent-violet-600"
            />
            <span className="text-xs font-medium text-gray-700">Rounded corners (card style)</span>
          </label>
        </div>

        {(design.borderTop || design.borderBottom) && (
          <ColorPicker label="Border colour" value={design.borderColor} onChange={(v) => set("borderColor", v)} />
        )}

        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1.5">Custom CSS class</label>
          <input type="text"
            value={design.customClass ?? ""}
            onChange={(e) => set("customClass", e.target.value)}
            placeholder="e.g. my-special-section"
            className="w-full text-xs font-mono border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-violet-400"
          />
        </div>
      </div>
    );
  }

  function renderMarqueeTab() {
    return (
      <div className="space-y-5">
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-violet-50 rounded-xl border border-violet-100">
          <input type="checkbox" checked={design.enableMarquee ?? false}
            onChange={(e) => set("enableMarquee", e.target.checked)}
            className="w-4 h-4 rounded accent-violet-600"
          />
          <div>
            <div className="text-sm font-semibold text-ink">Enable Marquee</div>
            <div className="text-xs text-gray-500">Content scrolls horizontally in an infinite loop</div>
          </div>
        </label>

        {design.enableMarquee && (
          <>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-2">Speed</label>
              <div className="flex gap-2">
                {(["slow","medium","fast"] as const).map((s) => (
                  <button key={s} onClick={() => set("marqueeSpeed", s)}
                    className={`flex-1 py-2 text-xs rounded-lg font-semibold capitalize border transition-all ${
                      (design.marqueeSpeed ?? "medium") === s
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                    }`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-2">Direction</label>
              <div className="flex gap-2">
                {(["left","right"] as const).map((d) => (
                  <button key={d} onClick={() => set("marqueeDirection", d)}
                    className={`flex-1 py-2 text-xs rounded-lg font-semibold capitalize border transition-all ${
                      (design.marqueeDirection ?? "left") === d
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                    }`}>
                    {d === "left" ? "← Left" : "Right →"}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={design.marqueePauseHover ?? true}
                onChange={(e) => set("marqueePauseHover", e.target.checked)}
                className="w-4 h-4 rounded accent-violet-600"
              />
              <span className="text-xs font-medium text-gray-700">Pause on hover</span>
            </label>
          </>
        )}
      </div>
    );
  }

  function renderSliderTab() {
    return (
      <div className="space-y-5">
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-violet-50 rounded-xl border border-violet-100">
          <input type="checkbox" checked={design.enableSlider ?? false}
            onChange={(e) => set("enableSlider", e.target.checked)}
            className="w-4 h-4 rounded accent-violet-600"
          />
          <div>
            <div className="text-sm font-semibold text-ink">Enable Slider / Carousel</div>
            <div className="text-xs text-gray-500">Items shown in a scrollable carousel</div>
          </div>
        </label>

        {design.enableSlider && (
          <>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-2">Transition style</label>
              <div className="flex gap-2">
                {(["slide","fade","none"] as const).map((t) => (
                  <button key={t} onClick={() => set("sliderType", t)}
                    className={`flex-1 py-2 text-xs rounded-lg font-semibold capitalize border transition-all ${
                      (design.sliderType ?? "slide") === t
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                    }`}>{t}</button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={design.sliderAutoplay ?? true}
                onChange={(e) => set("sliderAutoplay", e.target.checked)}
                className="w-4 h-4 rounded accent-violet-600"
              />
              <span className="text-xs font-medium text-gray-700">Autoplay</span>
            </label>
            {design.sliderAutoplay && (
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1.5">
                  Interval: {((design.sliderInterval ?? 4000) / 1000).toFixed(1)}s
                </label>
                <input type="range" min={1000} max={10000} step={500}
                  value={design.sliderInterval ?? 4000}
                  onChange={(e) => set("sliderInterval", parseInt(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  function renderImagesTab() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100">
          Images added here are passed as props to the section component and can be used as
          hero images, gallery items, or decorative elements depending on the section.
        </p>

        {/* Upload */}
        <div>
          <label className="flex items-center justify-center gap-2 cursor-pointer px-3 py-3 bg-violet-50 border-2 border-dashed border-violet-200 rounded-xl text-xs text-violet-700 font-semibold hover:bg-violet-100 transition-colors">
            {uploading ? "⏳ Uploading…" : "📎 Upload image"}
            <input
              type="file" accept="image/*" className="hidden"
              ref={fileRef}
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Image list */}
        {(design.images ?? []).length > 0 ? (
          <div className="space-y-2">
            {(design.images ?? []).map((img) => (
              <div key={img.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <img src={img.url} alt={img.alt ?? ""} className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    type="text"
                    value={img.alt ?? ""}
                    onChange={(e) => {
                      const updated = (design.images ?? []).map((i) => i.id === img.id ? { ...i, alt: e.target.value } : i);
                      set("images", updated);
                    }}
                    placeholder="Alt text"
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-400"
                  />
                  <select
                    value={img.position ?? "background"}
                    onChange={(e) => {
                      const updated = (design.images ?? []).map((i) => i.id === img.id ? { ...i, position: e.target.value as any } : i);
                      set("images", updated);
                    }}
                    className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    {["background","left","right","top","bottom"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <button onClick={() => removeImage(img.id)} className="text-red-400 hover:text-red-600 text-sm shrink-0 mt-0.5">✕</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-300 text-sm">No images added yet</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ maxHeight: "85vh" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0"
        style={{ background: "linear-gradient(135deg, #241c4d, #1a1333)" }}>
        <div>
          <div className="text-white font-bold text-sm">{section.label}</div>
          <div className="text-white/50 text-xs font-mono">{section.section_key}</div>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white text-lg leading-none transition-colors">✕</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 p-2 bg-gray-50 border-b border-gray-100 shrink-0 flex-wrap">
        {PANEL_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              tab === t.key
                ? "bg-white text-violet-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {tab === "bg"      && renderBgTab()}
        {tab === "text"    && renderTextTab()}
        {tab === "layout"  && renderLayoutTab()}
        {tab === "marquee" && renderMarqueeTab()}
        {tab === "slider"  && renderSliderTab()}
        {tab === "images"  && renderImagesTab()}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex gap-2 shrink-0 bg-gray-50">
        <button
          onClick={handleReset}
          className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 font-medium transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold transition-all hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "✅ Save Design"}
        </button>
      </div>
    </div>
  );
}

// ── Helper: build CSS background style from DesignSettings ────
export function buildBgStyle(design: DesignSettings): React.CSSProperties {
  const style: React.CSSProperties = {};
  const bgType = design.bgType ?? "solid";

  if (bgType === "solid" && design.bgColor) {
    style.background = design.bgColor;
  } else if (bgType === "gradient" && (design.bgGradientFrom || design.bgGradientTo)) {
    const dir = design.bgGradientDir ?? "to bottom";
    style.background = `linear-gradient(${dir}, ${design.bgGradientFrom ?? "#ffffff"}, ${design.bgGradientTo ?? "#f3f4f6"})`;
  } else if (bgType === "pattern") {
    const patternMap: Record<PatternType, string> = {
      dots:       `radial-gradient(circle, ${design.bgPatternColor ?? "#6c63ff"}${Math.round((design.bgPatternOpacity ?? 0.15) * 255).toString(16).padStart(2,"0")} 1.5px, transparent 1.5px)`,
      grid:       `linear-gradient(${design.bgPatternColor ?? "#6c63ff"}${Math.round((design.bgPatternOpacity ?? 0.15) * 255).toString(16).padStart(2,"0")} 1px, transparent 1px), linear-gradient(90deg, ${design.bgPatternColor ?? "#6c63ff"}${Math.round((design.bgPatternOpacity ?? 0.15) * 255).toString(16).padStart(2,"0")} 1px, transparent 1px)`,
      diagonal:   `repeating-linear-gradient(45deg, ${design.bgPatternColor ?? "#6c63ff"}22 0, ${design.bgPatternColor ?? "#6c63ff"}22 1px, transparent 0, transparent 50%)`,
      zigzag:     `repeating-linear-gradient(135deg, ${design.bgPatternColor ?? "#6c63ff"}22 0, ${design.bgPatternColor ?? "#6c63ff"}22 2px, transparent 0, transparent 10px)`,
      waves:      `repeating-radial-gradient(ellipse at 0% 50%, transparent 0%, transparent 45%, ${design.bgPatternColor ?? "#6c63ff"}22 50%, transparent 55%)`,
      hexagon:    `radial-gradient(circle, ${design.bgPatternColor ?? "#6c63ff"}22 30%, transparent 31%)`,
      crosshatch: `repeating-linear-gradient(45deg, ${design.bgPatternColor ?? "#6c63ff"}22 0, ${design.bgPatternColor ?? "#6c63ff"}22 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, ${design.bgPatternColor ?? "#6c63ff"}22 0, ${design.bgPatternColor ?? "#6c63ff"}22 1px, transparent 0, transparent 50%)`,
      circles:    `radial-gradient(circle at 50% 50%, transparent 30%, ${design.bgPatternColor ?? "#6c63ff"}22 30%, ${design.bgPatternColor ?? "#6c63ff"}22 32%, transparent 32%)`,
    };
    style.backgroundImage = patternMap[design.bgPattern ?? "dots"] ?? patternMap.dots;
    style.backgroundSize = "24px 24px";
    if (design.bgColor) style.backgroundColor = design.bgColor;
  } else if (bgType === "image" && design.bgImage) {
    style.backgroundImage = `url(${design.bgImage})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    if (design.bgImageOpacity !== undefined && design.bgImageOpacity < 1) {
      // Overlay trick — done via wrapper in SectionWrapper
      style.opacity = design.bgImageOpacity;
    }
  }

  return style;
}
