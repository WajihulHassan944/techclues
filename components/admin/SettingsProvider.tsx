"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logActivity } from "@/lib/admin/activity";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/admin/settings-defaults";
import { useInbox } from "./InboxProvider";

const KEY = "techclues-admin-settings-v1";

type Ctx = { settings: Settings; update: (patch: Partial<Settings>, message?: string, log?: string) => void; reset: () => void };

const SettingsCtx = createContext<Ctx | null>(null);
export const useSettings = () => {
  const c = useContext(SettingsCtx);
  if (!c) throw new Error("useSettings must be used inside SettingsProvider");
  return c;
};

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    let loaded: Settings | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
    } catch {
      loaded = null;
    }
    setSettings(loaded ?? DEFAULT_SETTINGS);
  }, []);

  useEffect(() => {
    if (!settings) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const api = useMemo<Ctx | null>(() => {
    if (!settings) return null;
    return {
      settings,
      update: (patch, message, log) => {
        setSettings((s) => (s ? { ...s, ...patch } : s));
        if (message) toast(message);
        if (log) logActivity("settings", log);
      },
      reset: () => {
        setSettings(DEFAULT_SETTINGS);
        toast("Settings restored to the defaults");
        logActivity("settings", "Restored the default settings");
      },
    };
  }, [settings, toast]);

  if (!api) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return <SettingsCtx.Provider value={api}>{children}</SettingsCtx.Provider>;
}
