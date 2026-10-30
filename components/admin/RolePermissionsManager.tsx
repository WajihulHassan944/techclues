"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { useInbox } from "./InboxProvider";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "seo_manager", label: "SEO Manager" },
  { value: "staff", label: "Staff" },
] as const;
type Role = (typeof ROLES)[number]["value"];

const MODULES = [
  { value: "inbox", label: "Inbox" },
  { value: "bookings", label: "Bookings" },
  { value: "blog", label: "Blog" },
  { value: "homepage", label: "Homepage" },
  { value: "case-studies", label: "Case studies" },
  { value: "services", label: "Services" },
  { value: "faqs", label: "FAQs" },
  { value: "footer-links", label: "Social links" },
  { value: "testimonials", label: "Testimonials" },
  { value: "media", label: "Media library" },
  { value: "newsletter", label: "Newsletter" },
  { value: "email-templates", label: "Email campaigns" },
  { value: "seo", label: "SEO" },
] as const;
type ModuleKey = (typeof MODULES)[number]["value"];

type Level = "none" | "view" | "edit";
type MatrixRow = { role: Role; modules: Record<ModuleKey, Level> };

const LEVEL_LABEL: Record<Level, string> = { none: "No access", view: "View only", edit: "Full edit" };

export default function RolePermissionsManager() {
  const { toast } = useInbox();
  const [matrix, setMatrix] = useState<MatrixRow[] | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<MatrixRow[]>("/api/admin/role-permissions")
      .then(setMatrix)
      .catch(() => setMatrix([]));
  }, []);

  if (!matrix) return <div className="adm-content adm-fadein" aria-busy="true" />;

  const byRole = (role: Role) => matrix.find((r) => r.role === role);

  const setLevel = (role: Role, module: ModuleKey, level: Level) => {
    const key = `${role}:${module}`;
    const prev = matrix;
    setMatrix((m) => (m ? m.map((r) => (r.role === role ? { ...r, modules: { ...r.modules, [module]: level } } : r)) : m));
    setSaving(key);
    api
      .patch("/api/admin/role-permissions", { role, module, level })
      .catch((e) => {
        setMatrix(prev);
        toast(e instanceof ApiError ? e.message : "Couldn't save that permission");
      })
      .finally(() => setSaving((s) => (s === key ? null : s)));
  };

  return (
    <section>
      <header style={{ marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Roles &amp; permissions</h2>
      </header>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        What each role can see and change in the panel. Super Admin always has full access and isn&rsquo;t shown here.
        Changes apply immediately.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table className="adm-table" style={{ minWidth: 720, borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgb(14 15 49 / 0.08)" }}>
              <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 13, color: "var(--color-muted)", fontWeight: 500 }}>Module</th>
              {ROLES.map((r) => (
                <th key={r.value} style={{ textAlign: "left", padding: "14px 16px", fontSize: 13, color: "var(--color-muted)", fontWeight: 500 }}>
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m) => (
              <tr key={m.value} style={{ borderBottom: "1px solid rgb(14 15 49 / 0.06)" }}>
                <td style={{ padding: "10px 16px", fontWeight: 500 }}>{m.label}</td>
                {ROLES.map((r) => {
                  const level = byRole(r.value)?.modules[m.value] ?? "none";
                  const key = `${r.value}:${m.value}`;
                  return (
                    <td key={r.value} style={{ padding: "10px 16px" }}>
                      <select
                        className="adm-input"
                        style={{ width: 130 }}
                        value={level}
                        disabled={saving === key}
                        onChange={(e) => setLevel(r.value, m.value, e.target.value as Level)}
                      >
                        {(Object.keys(LEVEL_LABEL) as Level[]).map((l) => (
                          <option key={l} value={l}>
                            {LEVEL_LABEL[l]}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
