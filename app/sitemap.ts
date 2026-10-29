import type { MetadataRoute } from "next";
import { UK_LOCATIONS } from "@/lib/data/uk-locations";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const SITE_URL = "https://techclues.co.uk";

const LOCATION_ENTRIES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/locations` },
  ...UK_LOCATIONS.map((l) => ({ url: `${SITE_URL}/locations/${l.slug}` })),
];

/** Proxies the backend's generated sitemap.xml (static routes + published blog/case-study slugs
 *  + any admin-added SEO pages, minus anything marked noindex) into Next's sitemap entry shape,
 *  plus the statically-generated location pages (which the backend doesn't know about). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/api/public/seo/sitemap.xml`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("bad status");
    const xml = await res.text();
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>(?:<lastmod>(.*?)<\/lastmod>)?/g)];
    return [...matches.map((m) => ({ url: m[1], lastModified: m[2] || undefined })), ...LOCATION_ENTRIES];
  } catch {
    return [{ url: SITE_URL }, ...LOCATION_ENTRIES];
  }
}
