"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./admin.css";

/** Last-resort boundary for errors outside the panel (e.g. the login page). */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="adm-root">
      <div className="adm-empty adm-empty-page" style={{ minHeight: "100vh", borderRadius: 0 }}>
        <h3>Something went wrong</h3>
        <p>Please try again or head back to the login page.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="adm-btn adm-btn-sm" onClick={reset}>
            Try again
          </button>
          <Link href="/admin/login" className="adm-btn adm-btn-sm adm-btn-danger">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
