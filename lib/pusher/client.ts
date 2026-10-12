"use client";

import { useEffect } from "react";
import Pusher, { type Channel } from "pusher-js";
import { api, getAccessToken } from "@/lib/api/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

let client: Pusher | null = null;
let channel: Channel | null = null;

function getChannel(): Channel | null {
  if (!KEY || !CLUSTER) return null;
  if (!client) {
    client = new Pusher(KEY, {
      cluster: CLUSTER,
      channelAuthorization: {
        transport: "ajax",
        endpoint: `${API_URL}/api/admin/pusher/auth`,
        customHandler: (params, callback) => {
          api
            .post<{ auth: string; channel_data?: string }>(
              "/api/admin/pusher/auth",
              { socket_id: params.socketId, channel_name: params.channelName },
            )
            .then((data) => callback(null, data))
            .catch((err) => callback(err as Error, null));
        },
      },
    });
    channel = client.subscribe("private-admin");
  }
  return channel;
}

/**
 * Tears down the shared connection — call this once, deliberately, on logout. Not tied to
 * component unmount: disconnecting from an effect cleanup races the socket's own connect/close
 * lifecycle (pusher-js can throw "undefined is not iterable" internally if disconnect() lands
 * while the socket is still CONNECTING), so the connection otherwise just stays open for the
 * tab's lifetime and is reused across admin page navigations.
 */
export function disconnectRealtime() {
  try {
    channel?.unbind_all();
    client?.unsubscribe("private-admin");
    client?.disconnect();
  } catch {
    // Best-effort teardown — a failure here must never crash the app.
  }
  client = null;
  channel = null;
}

export type AdminEvent = "enquiry.created" | "booking.created" | "booking.updated" | "subscriber.created" | "reply.sent" | "notification.created";

/** Subscribes to the admin realtime channel for as long as the component is mounted. */
export function useAdminRealtime(handlers: Partial<Record<AdminEvent, (data: unknown) => void>>) {
  useEffect(() => {
    if (!getAccessToken()) return; // not signed in yet — the auth call would fail
    const ch = getChannel();
    if (!ch) return;

    const bound: [AdminEvent, (data: unknown) => void][] = [];
    for (const [event, handler] of Object.entries(handlers)) {
      if (!handler) continue;
      ch.bind(event, handler);
      bound.push([event as AdminEvent, handler]);
    }

    return () => {
      try {
        for (const [event, handler] of bound) ch.unbind(event, handler);
      } catch {
        // Unbinding a channel that's already being torn down elsewhere must never crash the app.
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
