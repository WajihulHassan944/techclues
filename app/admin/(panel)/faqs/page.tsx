import type { Metadata } from "next";
import FaqManager from "@/components/admin/FaqManager";

export const metadata: Metadata = { title: "FAQs | TechClues admin" };

export default function Page() {
  return <FaqManager />;
}
