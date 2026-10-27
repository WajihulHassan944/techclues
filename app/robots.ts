import type { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const SITE_URL = "https://techclues.co.uk";

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const res = await fetch(`${API_URL}/api/public/seo/robots.txt`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("bad status");
    const text = await res.text();
    const disallow = [...text.matchAll(/^Disallow:\s*(.+)$/gm)].map((m) => m[1].trim());
    return {
      rules: { userAgent: "*", disallow: disallow.length ? disallow : undefined },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  } catch {
    return { rules: { userAgent: "*", disallow: ["/admin"] }, sitemap: `${SITE_URL}/sitemap.xml` };
  }
}
