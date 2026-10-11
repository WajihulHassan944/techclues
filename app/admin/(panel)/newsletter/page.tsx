import type { Metadata } from "next";
import PlaceholderPage, { type Planned } from "@/components/admin/PlaceholderPage";
import { IconDashboard, IconInbox, IconMail } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Newsletter | TechClues admin" };

const planned: Planned[] = [
  { title: "Subscribers", text: "Everyone who signed up, with the date and the page they used.", icon: IconMail },
  { title: "Export", text: "Download the list as a CSV file.", icon: IconInbox },
  { title: "Growth", text: "Sign-ups over time.", icon: IconDashboard },
];

export default function Page() {
  return <PlaceholderPage eyebrow="Content" title="Newsletter" lead="The people who subscribed through the website." planned={planned} />;
}
