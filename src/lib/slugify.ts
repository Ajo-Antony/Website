export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Parses lines like "Label: Value" into [{ label, value }] pairs. Blank lines are skipped. */
export function parseResultLines(input: string): { label: string; value: string }[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return { label: line, value: "" };
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    });
}

/** Turns [{label,value}] back into editable "Label: Value" lines for a textarea. */
export function formatResultLines(results: { label: string; value: string }[]): string {
  return results.map((r) => `${r.label}: ${r.value}`).join("\n");
}
