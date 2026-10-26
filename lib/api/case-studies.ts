const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type PublicCaseStudy = {
  _id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  services: string[];
  excerpt: string;
  cover: string;
  coverAlt?: string;
  featured: boolean;
  publishedAt: string;
  updatedAt?: string;
};
export type PublicCaseStudyFull = PublicCaseStudy & {
  body: string;
  images: string[];
  results: { value: string; label: string }[];
  testimonial: { quote: string; author: string; role: string };
  seoTitle?: string;
  seoDescription?: string;
};

/** Server-side fetchers for the public case studies list — no auth needed, revalidated periodically so admin edits show up. */
export async function listPublicCaseStudies(params?: { industry?: string; service?: string }): Promise<PublicCaseStudy[]> {
  const qs = new URLSearchParams({ pageSize: "50" });
  if (params?.industry) qs.set("industry", params.industry);
  if (params?.service) qs.set("service", params.service);
  const res = await fetch(`${API_URL}/api/public/case-studies?${qs}`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items;
}

export async function getPublicCaseStudy(slug: string): Promise<PublicCaseStudyFull | null> {
  const res = await fetch(`${API_URL}/api/public/case-studies/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}
