"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";

/**
 * Catches client-side exceptions anywhere in the admin panel so a stray error (realtime,
 * a provider, anything else) shows a recoverable screen instead of Next's blank
 * "Application error" page, which otherwise requires a hard refresh to escape.
 */
export default function AdminPanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error("[admin panel]", error);
  }, [error]);

  const backToLogin = () => {
    logout().finally(() => router.replace("/admin/login"));
  };

  return (
    <div className="adm-empty adm-empty-page" style={{ minHeight: "100vh", borderRadius: 0 }}>
      <h3>Something went wrong</h3>
      <p>The admin panel hit an unexpected error. You can try again, or sign back in.</p>
      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" className="adm-btn adm-btn-sm" onClick={reset}>
          Try again
        </button>
        <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={backToLogin}>
          Back to login
        </button>
      </div>
    </div>
  );
}
