import type { Metadata } from "next";
import SettingsView from "@/components/admin/SettingsView";

export const metadata: Metadata = { title: "Settings | TechClues admin" };

export default function Page() {
  return <SettingsView />;
}
