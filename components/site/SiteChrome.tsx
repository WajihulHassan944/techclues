"use client";

import { usePathname } from "next/navigation";

/** Renders the public site's header, footer and floating UI around the page, but not on /admin. */
export default function SiteChrome({ top, bottom, children }: { top: React.ReactNode; bottom: React.ReactNode; children: React.ReactNode }) {
  const path = usePathname();
  if (path === "/admin" || path.startsWith("/admin/")) return <>{children}</>;
  return (
    <>
      {top}
      {children}
      {bottom}
    </>
  );
}
