import type { Metadata } from "next";
import HomeContentManager from "@/components/admin/HomeContentManager";

export const metadata: Metadata = { title: "Homepage | TechClues admin" };

export default function Page() {
  return <HomeContentManager />;
}
