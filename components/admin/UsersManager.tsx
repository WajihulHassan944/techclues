"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { getAdminEmail } from "@/lib/api/auth";
import { useInbox } from "./InboxProvider";
import Dialog from "./Dialog";
import { IconPlus } from "./icons";

const ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "seo_manager", label: "SEO Manager" },
  { value: "staff", label: "Staff" },
] as const;
type Role = (typeof ROLES)[number]["value"];
const roleLabel = (r: string) => ROLES.find((x) => x.value === r)?.label ?? r;

type ApiUser = { _id: string; email: string; name?: string; role: Role; blocked: boolean; lastLoginAt?: string; twoFactorEnabled: boolean; createdAt: string };

export default function UsersManager() {
  const { toast } = useInbox();
  const [users, setUsers] = useState<ApiUser[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [resetTarget, setResetTarget] = useState<ApiUser | null>(null);
  const me = getAdminEmail();

  const load = () => api.get<ApiUser[]>("/api/admin/users").then(setUsers).catch(() => setUsers([]));
  useEffect(() => {
    load();
  }, []);

  if (!users) return <div className="adm-content adm-fadein" aria-busy="true" />;

  const setRole = (u: ApiUser, role: Role) => {
    api
      .patch(`/api/admin/users/${u._id}`, { role })
      .then(() => {
        setUsers((l) => (l ? l.map((x) => (x._id === u._id ? { ...x, role } : x)) : l));
        toast(`${u.email} is now ${roleLabel(role)}`);
      })
      .catch((e) => toast(e instanceof ApiError ? e.message : "Couldn't change the role"));
  };

  const toggleBlocked = (u: ApiUser) => {
    api
      .patch(`/api/admin/users/${u._id}`, { blocked: !u.blocked })
      .then(() => {
        setUsers((l) => (l ? l.map((x) => (x._id === u._id ? { ...x, blocked: !u.blocked } : x)) : l));
        toast(u.blocked ? `${u.email} unblocked` : `${u.email} blocked`);
      })
      .catch((e) => toast(e instanceof ApiError ? e.message : "Couldn't update that user"));
  };

  const remove = (u: ApiUser) => {
    if (!confirm(`Remove ${u.email}? This can't be undone.`)) return;
    api
      .delete(`/api/admin/users/${u._id}`)
      .then(() => {
        setUsers((l) => (l ? l.filter((x) => x._id !== u._id) : l));
        toast(`${u.email} removed`);
      })
      .catch((e) => toast(e instanceof ApiError ? e.message : "Couldn't remove that user"));
  };

  return (
    <section>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => setAdding(true)}>
          <IconPlus /> Add user
        </button>
      </header>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        Who can sign in to this admin panel, and what they can do. Only a Super Admin can manage users.
      </p>

      <ul className="adm-list">
        {users.map((u) => (
          <li key={u._id} className="adm-card" style={{ padding: 20, opacity: u.blocked ? 0.55 : 1 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <strong>{u.name || u.email}</strong>
                <div className="adm-muted" style={{ fontSize: 13 }}>
                  {u.email}
                  {u.email === me && " (you)"}
                  {u.blocked && " · Blocked"}
                  {u.twoFactorEnabled && " · 2FA on"}
                </div>
              </div>
              <select className="adm-input" style={{ width: 170 }} value={u.role} disabled={u.email === me} onChange={(e) => setRole(u, e.target.value as Role)}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <button type="button" className="adm-mini" disabled={u.email === me} onClick={() => toggleBlocked(u)}>
                {u.blocked ? "Unblock" : "Block"}
              </button>
              <button type="button" className="adm-mini" onClick={() => setResetTarget(u)}>
                Reset password
              </button>
              <button type="button" className="adm-mini adm-mini-danger" disabled={u.email === me} onClick={() => remove(u)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {adding && (
        <AddUserDialog
          onClose={() => setAdding(false)}
          onCreated={(u) => {
            setUsers((l) => (l ? [...l, u] : l));
            setAdding(false);
          }}
        />
      )}
      {resetTarget && <ResetPasswordDialog user={resetTarget} onClose={() => setResetTarget(null)} />}
    </section>
  );
}

function AddUserDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (u: ApiUser) => void }) {
  const { toast } = useInbox();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [err, setErr] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setErr("Use at least 8 characters.");
    setErr(undefined);
    setBusy(true);
    try {
      const created = await api.post<ApiUser>("/api/admin/users", { email: email.trim(), name: name.trim(), password, role });
      onCreated(created);
      toast(`${email} added as ${roleLabel(role)}`);
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Couldn't add that user.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog title="Add a user" onClose={onClose}>
      <form className="adm-form" id="add-user-form" onSubmit={submit}>
        <div className="adm-field">
          <label htmlFor="nu-name">Name</label>
          <input id="nu-name" className="adm-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="adm-field">
          <label htmlFor="nu-email">Email</label>
          <input id="nu-email" className="adm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="adm-field">
          <label htmlFor="nu-password">Temporary password</label>
          <input id="nu-password" className="adm-input" type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="adm-field">
          <label htmlFor="nu-role">Role</label>
          <select id="nu-role" className="adm-input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {err && <small className="adm-err">{err}</small>}
      </form>
      <div className="adm-dlg-foot-btns" style={{ marginTop: 16 }}>
        <button type="submit" form="add-user-form" className="adm-btn adm-btn-sm" disabled={busy}>
          {busy ? "Adding…" : "Add user"}
        </button>
        <button type="button" className="adm-mini adm-mini-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

function ResetPasswordDialog({ user, onClose }: { user: ApiUser; onClose: () => void }) {
  const { toast } = useInbox();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setErr("Use at least 8 characters.");
    setBusy(true);
    try {
      await api.patch(`/api/admin/users/${user._id}/password`, { password });
      toast(`Password reset for ${user.email}`);
      onClose();
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Couldn't reset that password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog title={`Reset password for ${user.email}`} onClose={onClose}>
      <form className="adm-form" id="reset-pw-form" onSubmit={submit}>
        <div className="adm-field">
          <label htmlFor="rp-pw">New password</label>
          <input id="rp-pw" className="adm-input" type="text" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </div>
        {err && <small className="adm-err">{err}</small>}
      </form>
      <div className="adm-dlg-foot-btns" style={{ marginTop: 16 }}>
        <button type="submit" form="reset-pw-form" className="adm-btn adm-btn-sm" disabled={busy}>
          {busy ? "Saving…" : "Set password"}
        </button>
        <button type="button" className="adm-mini adm-mini-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
