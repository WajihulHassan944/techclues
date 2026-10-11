"use client";

import { useSyncExternalStore } from "react";

export type ActivityKind = "inbox" | "bookings" | "blog" | "newsletter" | "settings" | "security";
export type Activity = { id: string; at: string; kind: ActivityKind; text: string };

export const ACTIVITY_LABEL: Record<ActivityKind, string> = { inbox: "Inbox", bookings: "Bookings", blog: "Blog", newsletter: "Newsletter", settings: "Settings", security: "Sign-ins" };

const KEY = "techclues-admin-activity-v1";
const EVENT = "adm-activity";
const MAX = 300;

function sample(now: number): Activity[] {
  const a = (min: number, kind: ActivityKind, text: string, i: number): Activity => ({ id: `seed-${i}`, at: new Date(now - min * 60_000).toISOString(), kind, text });
  return [
    a(35, "security", "Signed in from this device", 0),
    a(160, "inbox", "Replied to James Carter (Shipment tracking platform for hauliers)", 1),
    a(190, "bookings", "Moved Emily Zhang's call to Thu 8 Oct, 10:00", 2),
    a(1500, "blog", "Published “How much does an MVP cost in the UK?”", 3),
    a(1800, "newsletter", "Added subscriber maya.ellis@example.com", 4),
    a(3000, "settings", "Updated the email signature", 5),
    a(4300, "inbox", "Marked 2 enquiries as spam", 6),
    a(7000, "security", "Signed in from this device", 7),
  ];
}

let cache: Activity[] | null = null;
let raw = "";

function read(): Activity[] {
  if (typeof window === "undefined") return [];
  let s: string | null = null;
  try {
    s = localStorage.getItem(KEY);
  } catch {
    s = null;
  }
  if (s !== null && s === raw && cache) return cache;
  let list: Activity[] | null = null;
  if (s) {
    try {
      list = JSON.parse(s) as Activity[];
    } catch {
      list = null;
    }
  }
  if (!list) {
    list = sample(Date.now());
    write(list);
    return list;
  }
  raw = s ?? "";
  cache = list;
  return list;
}

function write(list: Activity[]) {
  cache = list;
  raw = JSON.stringify(list);
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Records something done in the panel. Safe to call from anywhere on the client. */
export function logActivity(kind: ActivityKind, text: string) {
  if (typeof window === "undefined") return;
  const list = read();
  write([{ id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), kind, text }, ...list].slice(0, MAX));
}

export function clearActivity() {
  write([]);
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const EMPTY: Activity[] = [];

export function useActivity(): Activity[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
