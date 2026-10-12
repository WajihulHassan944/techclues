const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type PublicPost = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  coverAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  author: { name: string; role: string } | null;
};
export type PublicPostFull = PublicPost & { body: string; seoTitle?: string; seoDescription?: string };

/** Server-side fetchers for the public blog — no auth needed, revalidated periodically so admin edits show up. */
export async function listPublicPosts(): Promise<PublicPost[]> {
  const res = await fetch(`${API_URL}/api/public/blog?pageSize=50`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items;
}

export async function getPublicPost(slug: string): Promise<PublicPostFull | null> {
  const res = await fetch(`${API_URL}/api/public/blog/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}
