import type { Metadata } from "next";
import ServiceManager from "@/components/admin/ServiceManager";

export const metadata: Metadata = { title: "Services | TechClues admin" };

export default function Page() {
  return <ServiceManager />;
}
