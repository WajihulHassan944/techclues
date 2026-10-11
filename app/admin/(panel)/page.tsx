import type { Metadata } from "next";
import Dashboard from "@/components/admin/Dashboard";

export const metadata: Metadata = { title: "Dashboard | TechClues admin" };

export default function Page() {
  return <Dashboard />;
}
