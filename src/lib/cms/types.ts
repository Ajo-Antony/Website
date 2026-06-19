// ── CMS field/schema definitions ───────────────────────────────────────────
// Drives the generic admin "Site Content" editor (src/app/admin/content).
// Every editable block of copy on the public site is described here once,
// then both the admin form AND the public page read from the same schema.

export type FieldType =
  | "text"        // single-line string
  | "textarea"    // multi-line string
  | "image"       // URL string, editable via upload or pasted URL
  | "boolean"     // checkbox
  | "stringlist"  // array of plain strings (e.g. client logos)
  | "array";      // array of objects, each shaped by `itemFields`

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  rows?: number;
  helpText?: string;
  itemFields?: FieldDef[];
  itemLabel?: string;
}

export interface SectionSchema {
  key: string;
  label: string;
  group: string;
  description?: string;
  fields: FieldDef[];
}

// Generic JSON content shape stored per-section.
export type ContentValue = Record<string, unknown>;
