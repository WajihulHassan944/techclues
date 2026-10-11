import type { Metadata } from "next";
import EnquiryDetail from "@/components/admin/EnquiryDetail";

export const metadata: Metadata = { title: "Enquiry | TechClues admin" };

/** Enquiries are client-side sample data for now, so the sample ids are prerendered. */
export function generateStaticParams() {
  return Array.from({ length: 17 }, (_, i) => ({ id: `enq-${1001 + i}` }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EnquiryDetail id={id} />;
}
