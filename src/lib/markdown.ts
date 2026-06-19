import { marked } from "marked";

marked.setOptions({ breaks: true });

/** Renders trusted, owner-authored Markdown to HTML. Not for untrusted/public input. */
export function renderMarkdown(content: string): string {
  return marked.parse(content) as string;
}
