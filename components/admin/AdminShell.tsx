"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAdminEmail, logout as apiLogout, restoreSession } from "@/lib/api/auth";
import { NAV, itemFor } from "./nav";
import InboxProvider, { useInbox } from "./InboxProvider";
import BookingsProvider, { useBookings } from "./BookingsProvider";
import BlogProvider from "./BlogProvider";
import NewsletterProvider, { useNewsletter } from "./NewsletterProvider";
import SettingsProvider from "./SettingsProvider";
import { useAdminRealtime } from "@/lib/pusher/client";
import { IconChevronDown, IconClose, IconExternal, IconLogout, IconMenu, IconSettings, IconShield } from "./icons";
import SearchBox from "./SearchBox";
import NotificationBell from "./NotificationBell";

function useOutside(ref: React.RefObject<HTMLElement | null>, onOut: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOut();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOut();
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [ref, onOut, active]);
}

/** Keeps the panel live: refreshes the relevant provider and toasts when something happens elsewhere. */
function RealtimeBridge() {
  const { toast, refresh: refreshInbox } = useInbox();
  const { refresh: refreshBookings } = useBookings();
  const { refresh: refreshSubs } = useNewsletter();

  useAdminRealtime({
    "enquiry.created": (data) => {
      const d = data as { name?: string; subject?: string };
      toast(`New enquiry${d.name ? ` from ${d.name}` : ""}`);
      refreshInbox();
    },
    "booking.created": (data) => {
      const d = data as { name?: string };
      toast(`New booking${d.name ? ` from ${d.name}` : ""}`);
      refreshBookings();
    },
    "booking.updated": () => refreshBookings(),
    "subscriber.created": (data) => {
      const d = data as { email?: string };
      toast(`New subscriber${d.email ? `: ${d.email}` : ""}`);
      refreshSubs();
    },
    "reply.sent": () => refreshInbox(),
  });

  return null;
}

function NavBadge({ href, fallback }: { href: string; fallback?: string }) {
  const { unread } = useInbox();
  const { bookings } = useBookings();
  const [now] = useState(() => Date.now());
  const soon = bookings.filter((b) => b.status === "confirmed" && new Date(b.start).getTime() > now && new Date(b.start).getTime() < now + 7 * 86_400_000).length;
  const n = href === "/admin/inbox" ? (unread > 0 ? String(unread) : "") : href === "/admin/bookings" ? (soon > 0 ? String(soon) : "") : (fallback ?? "");
  return n ? <span className="adm-badge">{n}</span> : null;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState<"user" | null>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const current = itemFor(path);

  // The panel opens only once a session is restored from the refresh-token cookie.
  useEffect(() => {
    restoreSession().then((ok) => {
      if (!ok) router.replace("/admin/login");
      else setReady(true);
    });
  }, [router]);

  useEffect(() => {
    setDrawer(false);
    setMenu(null);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  useOutside(userRef, () => setMenu(null), menu === "user");

  const logout = () => {
    apiLogout().finally(() => router.replace("/admin/login"));
  };

  if (!ready) return <div className="adm-shell" aria-busy="true" style={{ minHeight: "100vh" }} />;

  return (
    <InboxProvider>
    <BookingsProvider>
    <BlogProvider>
    <NewsletterProvider>
    <SettingsProvider>
    <RealtimeBridge />
    <div className="adm-shell">
      <div className="adm-scrim" data-open={drawer} onClick={() => setDrawer(false)} aria-hidden="true" />
      <aside className="adm-side" data-open={drawer} aria-label="Admin navigation">
        <div className="adm-brand">
          <Link href="/admin" aria-label="TechClues admin home">
            <img src="/images/techclues-logo.png" alt="TechClues" width={190} height={30} />
          </Link>
          <button type="button" className="adm-icon-btn adm-menu-btn" aria-label="Close menu" onClick={() => setDrawer(false)} style={{ width: 38, height: 38 }}>
            <IconClose />
          </button>
        </div>
        <nav className="adm-nav" aria-label="Main">
          {NAV.map((g) => (
            <div key={g.label}>
              <p className="adm-group-label">{g.label}</p>
              <ul className="adm-links">
                {g.items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <li key={it.href}>
                      <Link href={it.href} className="adm-link" aria-current={current.href === it.href ? "page" : undefined}>
                        <Icon />
                        {it.label}
                        <NavBadge href={it.href} fallback={it.badge} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="adm-icon-btn adm-menu-btn" aria-label="Open menu" onClick={() => setDrawer(true)}>
            <IconMenu />
          </button>
          <h1>{current.title ?? current.label}</h1>
          <div className="adm-top-spacer" />
          <SearchBox />
          <Link href="/" target="_blank" rel="noopener" className="adm-site-link">
            <span>View site</span>
            <IconExternal />
          </Link>
          <NotificationBell />
          <div className="adm-pop-wrap" ref={userRef}>
            <button type="button" className="adm-avatar-btn" aria-haspopup="true" aria-expanded={menu === "user"} aria-label="Account menu" onClick={() => setMenu(menu === "user" ? null : "user")}>
              <span className="adm-avatar">TC</span>
              <span className="adm-name" style={{ fontSize: 14.5 }}>
                Admin
              </span>
              <IconChevronDown />
            </button>
            {menu === "user" && (
              <div className="adm-pop" role="menu" aria-label="Account">
                <p className="adm-pop-head">
                  Signed in as
                  <strong>{getAdminEmail() ?? "Admin"}</strong>
                </p>
                <Link href="/admin/settings" className="adm-pop-item" role="menuitem">
                  <IconSettings /> Settings
                </Link>
                <Link href="/admin/settings" className="adm-pop-item" role="menuitem">
                  <IconShield /> Password &amp; security
                </Link>
                <div className="adm-pop-sep" />
                <button type="button" className="adm-pop-item" role="menuitem" onClick={logout}>
                  <IconLogout /> Log out
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="adm-content adm-fadein" key={path}>
          {children}
        </main>
      </div>
    </div>
    </SettingsProvider>
    </NewsletterProvider>
    </BlogProvider>
    </BookingsProvider>
    </InboxProvider>
  );
}