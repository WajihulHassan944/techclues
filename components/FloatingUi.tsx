"use client";

import { useState } from "react";
import ContactDock from "./generated/ContactDock";
import ChatLauncher from "./generated/ChatLauncher";
import CookieBanner from "./generated/CookieBanner";

/** Fixed-position widgets: contact dock, chat launcher and the dismissible cookie banner. */
export default function FloatingUi() {
  const [cookiesDismissed, setCookiesDismissed] = useState(false);
  return (
    <>
      <ContactDock />
      <ChatLauncher />
      {!cookiesDismissed && (
        <div
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("button")) setCookiesDismissed(true);
          }}
        >
          <CookieBanner />
        </div>
      )}
    </>
  );
}
