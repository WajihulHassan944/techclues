/** Shown in place of a provider's own content while its data is still loading (the providers
 * nest above the shell's chrome too, so this is what's visible under the sidebar/topbar). */
export function AdminContentSkeleton() {
  return (
    <div className="adm-sk-cards" aria-busy="true" style={{ minHeight: "60vh" }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="adm-sk adm-sk-card" />
      ))}
      <span className="adm-sk adm-sk-block" style={{ gridColumn: "1 / -1" }} />
    </div>
  );
}

/** Shown in place of the panel while a session is being restored, so a fresh load or a refresh
 * never shows a blank page — only a real network error (handled elsewhere) should. */
export default function AdminSkeleton() {
  return (
    <div className="adm-shell" aria-busy="true" aria-label="Loading your admin panel">
      <aside className="adm-side">
        <div className="adm-brand">
          <span className="adm-sk adm-sk-logo" />
        </div>
        {[3, 4, 3].map((n, i) => (
          <div key={i} className="adm-sk-group">
            <span className="adm-sk adm-sk-label" />
            {Array.from({ length: n }).map((_, j) => (
              <span key={j} className="adm-sk adm-sk-link" />
            ))}
          </div>
        ))}
      </aside>
      <div className="adm-main">
        <header className="adm-top">
          <span className="adm-sk adm-sk-title" />
          <div className="adm-top-spacer" />
          <span className="adm-sk adm-sk-pill" />
          <span className="adm-sk adm-sk-avatar" />
        </header>
        <main className="adm-content">
          <div className="adm-sk-cards">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="adm-sk adm-sk-card" />
            ))}
          </div>
          <span className="adm-sk adm-sk-block" />
        </main>
      </div>
    </div>
  );
}
