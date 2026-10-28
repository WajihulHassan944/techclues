import type { Metadata } from "next";
import EmailBuilderTabs from "@/components/admin/EmailBuilderTabs";

export const metadata: Metadata = { title: "Email campaigns | TechClues admin" };

export default function Page() {
  return <EmailBuilderTabs />;
}
