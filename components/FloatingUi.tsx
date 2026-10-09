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

/** Fixed-position widgets: contact dock, enquiry chat panel and the cookie banner. */
export default function FloatingUi() {
  const [cookie, setCookie] = useState<Cookie>("banner");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setChatOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
    setCookie(btn.textContent?.trim() === "Manage" ? "manage" : "closed");
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
