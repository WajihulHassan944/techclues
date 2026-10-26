import type { Metadata } from "next";
import FooterLinkManager from "@/components/admin/FooterLinkManager";

export const metadata: Metadata = { title: "Footer links | TechClues admin" };

export default function Page() {
  return <FooterLinkManager />;
}
