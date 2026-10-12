"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";

export type ActivityKind = "inbox" | "bookings" | "blog" | "faq" | "newsletter" | "settings" | "security";
export type Activity = { id: string; at: string; kind: ActivityKind; text: string };

export const ACTIVITY_LABEL: Record<ActivityKind, string> = { inbox: "Inbox", bookings: "Bookings", blog: "Blog", faq: "FAQs", newsletter: "Newsletter", settings: "Settings", security: "Sign-ins" };

type ApiActivity = { _id: string; at: string; kind: ActivityKind; text: string };
const mapActivity = (a: ApiActivity): Activity => ({ id: a._id, at: a.at, kind: a.kind, text: a.text });

/**
 * Records something the backend has no other record of (CSV exports, test emails, etc).
 * Fire-and-forget — most admin actions are already logged server-side by the API itself.
 */
export function logActivity(kind: ActivityKind, text: string) {
  api.post("/api/admin/activity", { kind, text }).catch(() => {});
}

export function useActivity(): [Activity[], () => void] {
  const [list, setList] = useState<Activity[]>([]);
  const refresh = useCallback(() => {
    api
      .get<ApiActivity[]>("/api/admin/activity")
      .then((rows) => setList(rows.map(mapActivity)))
      .catch(() => {});
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return [list, refresh];
}

export async function clearActivity() {
  await api.delete("/api/admin/activity");
}
