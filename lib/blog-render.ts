/** Public blog rendering helpers: turn stored article HTML into a table of contents with working anchors. */

export type TocItem = { id: string; text: string; level: 2 | 3 };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "section";

const textOf = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Gives every <h2>/<h3> in the article body a stable id (generated from its text, or reused if
 * the author already set one) and returns the heading list for the "On this page" sidebar. This
 * way the table of contents always matches whatever the admin's rich editor currently holds.
 */
export function renderArticle(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seen = new Set<string>();
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, levelStr, attrs, inner) => {
    const level = Number(levelStr) as 2 | 3;
    const existingId = /\bid=["']([^"']+)["']/.exec(attrs)?.[1];
    const text = textOf(inner);
    if (!text) return full;
    let id = existingId ?? slugify(text);
    let n = 2;
    while (seen.has(id)) id = `${existingId ?? slugify(text)}-${n++}`;
    seen.add(id);
    toc.push({ id, text, level });
    const attrsWithoutId = attrs.replace(/\s*\bid=["'][^"']*["']/i, "");
    return `<h${level}${attrsWithoutId} id="${id}">${inner}</h${level}>`;
  });
  return { html: out, toc };
}

export const wordCount = (html: string) => (textOf(html).match(/\S+/g) ?? []).length;
export const readMinutes = (html: string) => Math.max(1, Math.round(wordCount(html) / 220));

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
