"use client";

import { useEffect } from "react";
import Pusher, { type Channel } from "pusher-js";
import { api, getAccessToken } from "@/lib/api/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

let client: Pusher | null = null;
let channel: Channel | null = null;
let refCount = 0;

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

export type AdminEvent = "enquiry.created" | "booking.created" | "booking.updated" | "subscriber.created" | "reply.sent" | "notification.created";

/** Subscribes to the admin realtime channel for as long as the component is mounted. */
export function useAdminRealtime(handlers: Partial<Record<AdminEvent, (data: unknown) => void>>) {
  useEffect(() => {
    if (!getAccessToken()) return; // not signed in yet — the auth call would fail
    const ch = getChannel();
    if (!ch) return;
    refCount++;

    const bound: [AdminEvent, (data: unknown) => void][] = [];
    for (const [event, handler] of Object.entries(handlers)) {
      if (!handler) continue;
      ch.bind(event, handler);
      bound.push([event as AdminEvent, handler]);
    }

    return () => {
      for (const [event, handler] of bound) ch.unbind(event, handler);
      refCount--;
      if (refCount <= 0 && client) {
        client.unsubscribe("private-admin");
        client.disconnect();
        client = null;
        channel = null;
        refCount = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
