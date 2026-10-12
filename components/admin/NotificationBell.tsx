"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import { preload } from "@/lib/admin/prefetch";
import { useAdminRealtime } from "@/lib/pusher/client";
import { fmtWhen } from "@/lib/admin/format";
import { IconBell } from "./icons";

type ApiNotification = { _id: string; type: string; message: string; link?: string; read: boolean; at: string };

export function preloadNotifications(force = false) {
  return preload("admin-notifications", () => api.get<{ items: ApiNotification[]; unread: number }>("/api/admin/notifications"), force);
}

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ApiNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [now] = useState(() => Date.now());
  const wrapRef = useRef<HTMLDivElement>(null);

  const load = useCallback((force = false) => {
    preloadNotifications(force)
      .then((r) => {
        setItems(r.items);
        setUnread(r.unread);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useAdminRealtime({ "notification.created": () => load(true) });

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const markAllRead = () => {
    setUnread(0);
    setItems((l) => l.map((i) => ({ ...i, read: true })));
    api.post("/api/admin/notifications/read-all").catch(() => load(true));
  };

  const openItem = (n: ApiNotification) => {
    setOpen(false);
    api.post(`/api/admin/notifications/${n._id}/read`).catch(() => {});
    setItems((l) => l.map((i) => (i._id === n._id ? { ...i, read: true } : i)));
    setUnread((u) => Math.max(0, u - (n.read ? 0 : 1)));
    if (n.link) router.push(n.link);
  };

  return (
    <div className="adm-pop-wrap" ref={wrapRef}>
      <button type="button" className="adm-icon-btn" aria-label="Notifications" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <IconBell />
        {unread > 0 && <span className="adm-dot" />}
      </button>
      {open && (
        <div className="adm-pop" role="dialog" aria-label="Notifications">
          <p className="adm-pop-head" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
            <span>
              Notifications
              <strong>{unread > 0 ? `${unread} unread` : "You're all caught up"}</strong>
            </span>
            {unread > 0 && (
              <button type="button" className="adm-mini" style={{ flexShrink: 0 }} onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </p>
          {items.length === 0 ? (
            <div className="adm-pop-empty">
              <IconBell />
              Nothing new yet. New enquiries, bookings and subscribers will show up here.
            </div>
          ) : (
            items.map((n) => (
              <button key={n._id} type="button" className="adm-pop-item" style={{ height: "auto", minHeight: 44, padding: "8px 14px", opacity: n.read ? 0.6 : 1 }} onClick={() => openItem(n)}>
                <span style={{ overflow: "hidden" }}>
                  <strong style={{ display: "block", fontWeight: n.read ? 400 : 500 }}>{n.message}</strong>
                  <small style={{ color: "var(--color-muted)" }}>{fmtWhen(n.at, now)}</small>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
