"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * The page markup uses plain anchors, so every internal link would reload the whole site.
 * This hands same-site link clicks to the Next.js router instead (client-side navigation).
 */
export default function ClientNav() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || /^(mailto:|tel:|sms:|javascript:)/.test(href)) return;
      let url: URL;
      try {
        url = new URL(href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return; // files such as /logos.svg
      if (url.pathname === location.pathname && url.search === location.search) return; // hash jumps handled by the browser / Lenis
      e.preventDefault();
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);
  return null;
}
