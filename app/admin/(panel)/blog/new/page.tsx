import type { Metadata } from "next";
import NewPost from "@/components/admin/NewPost";

export const metadata: Metadata = { title: "New post | TechClues admin" };

export default function Page() {
  return <NewPost />;
}
