import type { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const SITE_URL = "https://techclues.co.uk";

/** Proxies the backend's generated sitemap.xml (static routes + published blog/case-study slugs
 *  + any admin-added SEO pages, minus anything marked noindex) into Next's sitemap entry shape. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/api/public/seo/sitemap.xml`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("bad status");
    const xml = await res.text();
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>(?:<lastmod>(.*?)<\/lastmod>)?/g)];
    return matches.map((m) => ({ url: m[1], lastModified: m[2] || undefined }));
  } catch {
    return [{ url: SITE_URL }];
  }
}
