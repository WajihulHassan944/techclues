import type { Metadata } from "next";
import PlaceholderPage, { type Planned } from "@/components/admin/PlaceholderPage";
import { IconBlog, IconMail, IconSettings, IconShield } from "@/components/admin/icons";

export const metadata: Metadata = { title: "Settings | TechClues admin" };

const planned: Planned[] = [
  { title: "Notifications", text: "New enquiries are emailed to info@techclues.co.uk. Change who is notified.", icon: IconMail },
  { title: "Reply templates and signature", text: "Saved replies and your email signature.", icon: IconBlog },
  { title: "Password and security", text: "Change your password and see recent sign-ins.", icon: IconShield },
  { title: "Privacy tools and activity log", text: "Export or delete one person's data, and see what changed and when.", icon: IconSettings },
];

export default function Page() {
  return <PlaceholderPage eyebrow="Account" title="Settings" lead="Notifications, reply templates and account security." planned={planned} />;
}
