import type { Metadata } from "next";
import PlaceholderPage, { type Planned } from "@/components/admin/PlaceholderPage";
import { IconInbox, IconMail, IconSearch, IconSettings } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Inbox | TechClues admin" };

const planned: Planned[] = [
  { title: "All forms in one place", text: "Contact, calculator, Kill my idea, grants, partners, ZERO.ONE and careers, filterable by source and status.", icon: IconInbox },
  { title: "Reply from the panel", text: "Read the full submission, write back with templates and send from info@techclues.co.uk.", icon: IconMail },
  { title: "Notes and status", text: "Mark enquiries new, replied, qualified, won, lost or spam, and keep private notes.", icon: IconSettings },
  { title: "Search and bulk actions", text: "Find any enquiry by name, email or text, and clear several at once.", icon: IconSearch },
];

export default function Page() {
  return <PlaceholderPage eyebrow="Enquiries" title="Inbox" lead="Every form submission in one list, with replies sent from here." planned={planned} />;
}
