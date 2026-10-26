import type { Metadata } from "next";
import NewCaseStudy from "@/components/admin/NewCaseStudy";

export const metadata: Metadata = { title: "New case study | TechClues admin" };

export default function Page() {
  return <NewCaseStudy />;
}
