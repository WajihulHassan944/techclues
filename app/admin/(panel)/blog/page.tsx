import type { Metadata } from "next";
import BlogManager from "@/components/admin/BlogManager";

export const metadata: Metadata = { title: "Blog | TechClues admin" };

export default function Page() {
  return <BlogManager />;
}
