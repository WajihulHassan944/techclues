"use client";

import { useEffect, useState } from "react";
import ContactDock from "./generated/ContactDock";
import ChatLauncher from "./generated/ChatLauncher";
import ChatLauncherOpen from "./generated/ChatLauncherOpen";
import ChatBackdrop from "./generated/ChatBackdrop";
import ChatDialog from "./generated/ChatDialog";
import CookieBanner from "./generated/CookieBanner";
import CookieManage from "./generated/CookieManage";

type Cookie = "banner" | "manage" | "closed";

/** localStorage key holding the visitor's cookie choice, so the banner only shows once. */
const CONSENT_KEY = "tc-cookie-consent";

/** Fixed-position widgets: contact dock, enquiry chat panel and the cookie banner. */
export default function FloatingUi() {
  const [cookie, setCookie] = useState<Cookie>("banner");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChatOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Rendering the banner by default (rather than reading localStorage in the initial
  // useState) keeps server and client markup identical on first paint, avoiding a
  // hydration mismatch — this effect corrects it a frame later if a choice was saved.
  useEffect(() => {
    try {
      if (localStorage.getItem(CONSENT_KEY)) setCookie("closed");
    } catch {
      // Private browsing / blocked storage — fall back to showing the banner each visit.
    }
  }, []);

  const onCookieClick = (e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest("button");
    if (!btn) return;
    if (btn.getAttribute("role") === "switch") {
      btn.setAttribute("aria-checked", String(btn.getAttribute("aria-checked") !== "true"));
      const on = btn.getAttribute("aria-checked") === "true";
      btn.classList.toggle("bg-ink/15", !on);
      btn.classList.toggle("bg-brand", on);
      (btn.firstElementChild as HTMLElement | null)?.style.setProperty("transform", on ? "translateX(20px)" : "none");
      return;
    }
    const label = btn.textContent?.trim();
    if (label === "Manage") {
      setCookie("manage");
      return;
    }
    // Accept all / Reject all / Save choices — all three are a final decision: persist it
    // so the banner doesn't come back on the next page or reload.
    try {
      localStorage.setItem(CONSENT_KEY, label === "Reject all" ? "rejected" : "accepted");
    } catch {
      // Private browsing / blocked storage — the choice just won't stick across reloads.
    }
    setCookie("closed");
  };

  const onChatClick = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest(".chat-launcher") || t.closest('button[aria-label="Close"]') || t.closest("[aria-hidden='true'].fixed")) {
      setChatOpen((o) => !o);
      return;
    }
    const pill = t.closest<HTMLButtonElement>("button[aria-pressed]");
    if (pill) pill.setAttribute("aria-pressed", String(pill.getAttribute("aria-pressed") !== "true"));
  };

  return (
    <>
      <ContactDock />
      <div onClick={onChatClick} onSubmit={(e) => e.preventDefault()}>
        {chatOpen ? (
          <>
            <ChatBackdrop />
            <ChatDialog />
            <ChatLauncherOpen />
          </>
        ) : (
          <ChatLauncher />
        )}
      </div>
      {cookie !== "closed" && (
        <div onClick={onCookieClick}>{cookie === "banner" ? <CookieBanner /> : <CookieManage />}</div>
      )}
    </>
  );
}
