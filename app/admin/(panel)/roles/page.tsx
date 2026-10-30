import type { Metadata } from "next";
import RolePermissionsManager from "@/components/admin/RolePermissionsManager";

export const metadata: Metadata = { title: "Roles & permissions | TechClues admin" };

export default function Page() {
  return <RolePermissionsManager />;
}
