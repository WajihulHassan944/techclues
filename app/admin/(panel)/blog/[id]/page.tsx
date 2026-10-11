import type { Metadata } from "next";
import PostEditor from "@/components/admin/PostEditor";
import { SEED_IDS } from "@/lib/admin/blog-seed";

export const metadata: Metadata = { title: "Edit post | TechClues admin" };

/** The sample posts are prerendered; posts created in the panel are rendered on demand. */
export function generateStaticParams() {
  return SEED_IDS.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostEditor id={id} />;
}
