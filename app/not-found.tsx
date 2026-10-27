"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${API_URL}/api/public/seo/404`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || undefined }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "70vh", textAlign: "center", padding: 24 }}>
      <div>
        <h1 style={{ fontSize: "clamp(2rem,6vw,3.5rem)", marginBottom: 12 }}>Page not found</h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>That page doesn&apos;t exist or has moved.</p>
        <Link href="/" style={{ color: "#0038b8", fontWeight: 500 }}>
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
