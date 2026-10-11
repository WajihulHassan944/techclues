import type { Metadata } from "next";
import NewsletterView from "@/components/admin/NewsletterView";

export const metadata: Metadata = { title: "Newsletter | TechClues admin" };

export default function Page() {
  return <NewsletterView />;
}
