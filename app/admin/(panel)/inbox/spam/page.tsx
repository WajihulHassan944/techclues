import type { Metadata } from "next";
import PlaceholderPage, { type Planned } from "@/components/admin/PlaceholderPage";
import { IconBan, IconInbox, IconShield } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Spam & trash | TechClues admin" };

const planned: Planned[] = [
  { title: "Spam folder", text: "Flagged submissions wait here so you can double-check them.", icon: IconBan },
  { title: "Block senders", text: "Block an email address or domain from future submissions.", icon: IconShield },
  { title: "Trash and restore", text: "Deleted enquiries can be restored for a while before they are removed.", icon: IconInbox },
];

export default function Page() {
  return <PlaceholderPage eyebrow="Enquiries" title="Spam & trash" lead="Junk and deleted enquiries stay here until you clear them." planned={planned} />;
}
