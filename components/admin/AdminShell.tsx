"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ADMIN_EMAIL, AUTH_KEY, NAV, itemFor } from "./nav";
import InboxProvider, { useInbox } from "./InboxProvider";
import { IconBell, IconChevronDown, IconClose, IconExternal, IconLogout, IconMenu, IconSearch, IconSettings, IconShield, IconSpark } from "./icons";

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

function NavBadge({ href, fallback }: { href: string; fallback?: string }) {
  const { unread } = useInbox();
  const n = href === "/admin/inbox" ? (unread > 0 ? String(unread) : "") : (fallback ?? "");
  return n ? <span className="adm-badge">{n}</span> : null;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState<"bell" | "user" | null>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const current = itemFor(path);

  // Static sign-in: the panel opens only after the login screen has been passed in this browser.
  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(AUTH_KEY) === "1";
    } catch {
      ok = false;
    }
    if (!ok) router.replace("/admin/login");
    else setReady(true);
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

  useOutside(bellRef, () => setMenu(null), menu === "bell");
  useOutside(userRef, () => setMenu(null), menu === "user");

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    router.replace("/admin/login");
  };

  if (!ready) return <div className="adm-shell" aria-busy="true" style={{ minHeight: "100vh" }} />;

  return (
    <InboxProvider>
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
        <div className="adm-side-foot">
          <strong>
            <IconSpark className="adm-ic" /> Static preview
          </strong>
          Screens use sample data for now. Nothing here is saved or sent yet.
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="adm-icon-btn adm-menu-btn" aria-label="Open menu" onClick={() => setDrawer(true)}>
            <IconMenu />
          </button>
          <h1>{current.title ?? current.label}</h1>
          <div className="adm-top-spacer" />
          <label className="adm-search">
            <span className="sr-only">Search the admin panel</span>
            <IconSearch />
            <input type="search" placeholder="Search enquiries, posts, people…" onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} />
          </label>
          <Link href="/" target="_blank" rel="noopener" className="adm-site-link">
            <span>View site</span>
            <IconExternal />
          </Link>
          <div className="adm-pop-wrap" ref={bellRef}>
            <button type="button" className="adm-icon-btn" aria-label="Notifications" aria-haspopup="true" aria-expanded={menu === "bell"} onClick={() => setMenu(menu === "bell" ? null : "bell")}>
              <IconBell />
              <span className="adm-dot" />
            </button>
            {menu === "bell" && (
              <div className="adm-pop" role="dialog" aria-label="Notifications">
                <p className="adm-pop-head">
                  Notifications
                  <strong>New enquiries appear here</strong>
                </p>
                <div className="adm-pop-empty">
                  <IconBell />
                  Nothing new yet. When a form is submitted, you&apos;ll see it here and get an email at {ADMIN_EMAIL}.
                </div>
              </div>
            )}
          </div>
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
                  <strong>{ADMIN_EMAIL}</strong>
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
    </InboxProvider>
  );
}