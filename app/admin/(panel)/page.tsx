import type { Metadata } from "next";
import PlaceholderPage, { type Planned } from "@/components/admin/PlaceholderPage";
import { IconCalendar, IconDashboard, IconInbox, IconMail } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Welcome back. | TechClues admin" };

const planned: Planned[] = [
  { title: "Enquiry numbers", text: "New, unanswered and total enquiries, with a trend over time.", icon: IconInbox },
  { title: "Needs a reply", text: "The oldest unanswered enquiries first, so nothing slips.", icon: IconMail },
  { title: "Upcoming calls", text: "Who you are speaking to next, and when.", icon: IconCalendar },
  { title: "Where enquiries come from", text: "Contact, calculator, grants, partners, ZERO.ONE, careers and more, side by side.", icon: IconDashboard },
];

export default function Page() {
  return <PlaceholderPage eyebrow="Overview" title="Welcome back." lead="A quick look at new enquiries, calls and what needs a reply." planned={planned} />;
}
