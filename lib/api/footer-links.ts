const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type FooterLinkItem = { label: string; href: string; newTab: boolean };
export type FooterLinkGroups = {
  services: FooterLinkItem[];
  company: FooterLinkItem[];
  sectors: FooterLinkItem[];
  social: FooterLinkItem[];
  legal: FooterLinkItem[];
};

const EMPTY: FooterLinkGroups = { services: [], company: [], sectors: [], social: [], legal: [] };

/** Server-side fetch for the public footer — no auth needed, revalidated periodically so admin edits show up. */
export async function getPublicFooterLinks(): Promise<FooterLinkGroups> {
  try {
    const res = await fetch(`${API_URL}/api/public/footer-links`, { next: { revalidate: 300 } });
    if (!res.ok) return EMPTY;
    return { ...EMPTY, ...(await res.json()) };
  } catch {
    return EMPTY;
  }
}
