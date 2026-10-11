export type PostStatus = "draft" | "scheduled" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorId: string;
  cover: string;
  coverAlt: string;
  /** Article body as HTML from the visual editor. */
  body: string;
  status: PostStatus;
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
};

export type Category = { id: string; name: string };
export type Author = { id: string; name: string; role: string };
export type BlogState = { posts: Post[]; categories: Category[]; authors: Author[] };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const text = (html: string) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#?\w+;/g, " ");

export const wordCount = (html: string) => (text(html).trim().match(/\S+/g) ?? []).length;
export const readMinutes = (html: string) => Math.max(1, Math.round(wordCount(html) / 220));

export type Heading = { level: 2 | 3; text: string };
export function headingsOf(html: string): Heading[] {
  const out: Heading[] = [];
  for (const m of html.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const t = text(m[2]).replace(/\s+/g, " ").trim();
    if (t) out.push({ level: Number(m[1]) as 2 | 3, text: t });
  }
  return out;
}

export const emptyBody = (html: string) => wordCount(html) === 0 && !/<img\b/i.test(html);
