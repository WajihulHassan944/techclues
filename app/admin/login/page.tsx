import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin sign in | TechClues" };

export default function Page() {
  return <LoginForm />;
}
