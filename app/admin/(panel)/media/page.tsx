import type { Metadata } from "next";
import MediaLibrary from "@/components/admin/MediaLibrary";

export const metadata: Metadata = { title: "Media library | TechClues admin" };

export default function Page() {
  return <MediaLibrary />;
}
