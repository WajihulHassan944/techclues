import type { Metadata } from "next";
import SpamTrashView from "@/components/admin/SpamTrashView";

export const metadata: Metadata = { title: "Spam & trash | TechClues admin" };

export default function Page() {
  return <SpamTrashView />;
}
