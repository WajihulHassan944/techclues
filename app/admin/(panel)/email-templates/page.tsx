import type { Metadata } from "next";
import EmailBuilder from "@/components/admin/EmailBuilder";

export const metadata: Metadata = { title: "Email campaigns | TechClues admin" };

export default function Page() {
  return <EmailBuilder />;
}
