import type { Metadata } from "next";
import PlaceholderPage, { type Planned } from "@/components/admin/PlaceholderPage";
import { IconCalendar, IconMail, IconSettings } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Bookings | TechClues admin" };

const planned: Planned[] = [
  { title: "Calendar and list", text: "See every booked call by day, week or list.", icon: IconCalendar },
  { title: "Reschedule or cancel", text: "Move or cancel a call and let the visitor know.", icon: IconMail },
  { title: "Availability", text: "Working hours, slot length and days you are unavailable.", icon: IconSettings },
];

export default function Page() {
  return <PlaceholderPage eyebrow="Enquiries" title="Bookings" lead="Calls booked through the website, in a calendar and a list." planned={planned} />;
}
