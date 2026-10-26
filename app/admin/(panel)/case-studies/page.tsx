import type { Metadata } from "next";
import CaseStudyManager from "@/components/admin/CaseStudyManager";

export const metadata: Metadata = { title: "Case studies | TechClues admin" };

export default function Page() {
  return <CaseStudyManager />;
}
