import type { Metadata } from "next";
import SeoManager from "@/components/admin/SeoManager";

export const metadata: Metadata = { title: "SEO | TechClues admin" };

export default function Page() {
  return <SeoManager />;
}
