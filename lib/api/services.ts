export type ServiceContent = {
  slug: string;
  cardTitle: string;
  cardDescription: string;
  features: string[];
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheading: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getPublicServices(): Promise<Record<string, ServiceContent>> {
  try {
    const res = await fetch(`${API_URL}/api/public/services`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("bad status");
    const rows: ServiceContent[] = await res.json();
    return Object.fromEntries(rows.map((s) => [s.slug, s]));
  } catch {
    return {};
  }
}

export async function getPublicService(slug: string): Promise<ServiceContent | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/services/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    return data ?? null;
  } catch {
    return null;
  }
}
