import type { Metadata } from "next";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";

export const metadata: Metadata = { title: "Edit case study | TechClues admin" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CaseStudyEditor id={id} />;
}
