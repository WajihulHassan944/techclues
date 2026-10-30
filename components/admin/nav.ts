import type { ComponentType } from "react";
import type { PermissionModuleKey } from "@/lib/api/permissions";
import { IconBan, IconBlog, IconCalendar, IconCaseStudy, IconDashboard, IconHelp, IconHome, IconInbox, IconLink2, IconMail, IconMedia, IconQuote, IconSearch, IconServices, IconSettings, IconShield, IconUsers } from "./icons";

export type AdminRole = "super_admin" | "admin" | "editor" | "seo_manager" | "staff";
/** `module` ties an item to the configurable permission matrix (view/edit per role, set by a
 * Super Admin on /admin/roles). `roles` is for the handful of items deliberately kept OUTSIDE
 * that matrix — Users management stays fixed to super_admin so the matrix can never grant it away. */
export type NavItem = { href: string; label: string; icon: ComponentType<{ className?: string }>; badge?: string; title?: string; module?: PermissionModuleKey; roles?: AdminRole[] };
export type NavGroup = { label: string; items: NavItem[] };

/** Badges are sample numbers until the panel is connected to real data. */
export const NAV: NavGroup[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: IconDashboard }] },
  {
    label: "Enquiries",
    items: [
      { href: "/admin/inbox", label: "Inbox", icon: IconInbox, module: "inbox" },
      { href: "/admin/inbox/spam", label: "Spam & trash", icon: IconBan, title: "Spam & trash", module: "inbox" },
      { href: "/admin/bookings", label: "Bookings", icon: IconCalendar, module: "bookings" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog", icon: IconBlog, module: "blog" },
      { href: "/admin/homepage", label: "Homepage", icon: IconHome, module: "homepage" },
      { href: "/admin/case-studies", label: "Case studies", icon: IconCaseStudy, module: "case-studies" },
      { href: "/admin/services", label: "Services", icon: IconServices, module: "services" },
      { href: "/admin/faqs", label: "FAQs", icon: IconHelp, module: "faqs" },
      { href: "/admin/footer-links", label: "Social links", icon: IconLink2, module: "footer-links" },
      { href: "/admin/testimonials", label: "Testimonials", icon: IconQuote, module: "testimonials" },
      { href: "/admin/media", label: "Media library", icon: IconMedia, module: "media" },
      { href: "/admin/newsletter", label: "Newsletter", icon: IconMail, module: "newsletter" },
      { href: "/admin/email-templates", label: "Email campaigns", icon: IconMail, module: "email-templates" },
    ],
  },
  {
    label: "Growth",
    items: [{ href: "/admin/seo", label: "SEO", icon: IconSearch, module: "seo" }],
  },
  {
    label: "Account",
    items: [
      { href: "/admin/settings", label: "Settings", icon: IconSettings },
      { href: "/admin/roles", label: "Roles & permissions", icon: IconShield, roles: ["super_admin"] },
      { href: "/admin/users", label: "Users", icon: IconUsers, roles: ["super_admin"] },
    ],
  },
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
