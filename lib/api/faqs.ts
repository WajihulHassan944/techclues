import type { AccordionItem } from "@/components/Accordion";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Server-side fetch for every public FAQ, grouped by page/section — shaped exactly like the
 * old static `serviceFaqs` map so pages that used it need only swap the import. Revalidated
 * periodically so admin edits show up without a full redeploy.
 */
export async function getFaqs(): Promise<Record<string, AccordionItem[]>> {
  const res = await fetch(`${API_URL}/api/public/faqs`, { next: { revalidate: 60 } });
  if (!res.ok) return {};
  return res.json();
}
