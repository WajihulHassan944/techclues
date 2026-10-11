import type { Metadata } from "next";
import PlaceholderPage, { type Planned } from "@/components/admin/PlaceholderPage";
import { IconBlog, IconCalendar, IconSettings, IconSpark } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Blog | TechClues admin" };

const planned: Planned[] = [
  { title: "Posts", text: "All posts with draft, scheduled and published status.", icon: IconBlog },
  { title: "Visual editor", text: "Format text, add images and headings, and see a live preview.", icon: IconSpark },
  { title: "Categories and authors", text: "Organise posts and credit the right person.", icon: IconSettings },
  { title: "Schedule and SEO", text: "Set a publish date, a title and a description for search engines.", icon: IconCalendar },
];

export default function Page() {
  return <PlaceholderPage eyebrow="Content" title="Blog" lead="Write, schedule and publish posts with a visual editor." planned={planned} />;
}
