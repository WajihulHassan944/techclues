import type { ComponentType } from "react";
import { IconBan, IconBlog, IconCalendar, IconCaseStudy, IconDashboard, IconHelp, IconInbox, IconLink2, IconMail, IconSettings } from "./icons";

export type NavItem = { href: string; label: string; icon: ComponentType<{ className?: string }>; badge?: string; title?: string };
export type NavGroup = { label: string; items: NavItem[] };

/** Badges are sample numbers until the panel is connected to real data. */
export const NAV: NavGroup[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: IconDashboard }] },
  {
    label: "Enquiries",
    items: [
      { href: "/admin/inbox", label: "Inbox", icon: IconInbox },
      { href: "/admin/inbox/spam", label: "Spam & trash", icon: IconBan, title: "Spam & trash" },
      { href: "/admin/bookings", label: "Bookings", icon: IconCalendar },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog", icon: IconBlog },
      { href: "/admin/case-studies", label: "Case studies", icon: IconCaseStudy },
      { href: "/admin/faqs", label: "FAQs", icon: IconHelp },
      { href: "/admin/footer-links", label: "Social links", icon: IconLink2 },
      { href: "/admin/newsletter", label: "Newsletter", icon: IconMail },
    ],
  },
  { label: "Account", items: [{ href: "/admin/settings", label: "Settings", icon: IconSettings }] },
];

export const ADMIN_EMAIL = "techcluesltd@gmail.com";
export const AUTH_KEY = "techclues-admin";

const FLAT = NAV.flatMap((g) => g.items);

/** The nav item that owns a path: the longest matching href wins (so /admin/inbox/spam beats /admin/inbox). */
export function itemFor(path: string): NavItem {
  const clean = path.replace(/\/+$/, "") || "/admin";
  let best = FLAT[0];
  for (const it of FLAT) if ((clean === it.href || clean.startsWith(it.href + "/")) && it.href.length >= best.href.length) best = it;
  return best;
}
