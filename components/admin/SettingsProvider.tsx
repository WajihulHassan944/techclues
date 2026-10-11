"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/admin/settings-defaults";
import { useInbox } from "./InboxProvider";

type Ctx = { settings: Settings; update: (patch: Partial<Settings>, message?: string) => void; refresh: () => void };

const SettingsCtx = createContext<Ctx | null>(null);
export const useSettings = () => {
  const c = useContext(SettingsCtx);
  if (!c) throw new Error("useSettings must be used inside SettingsProvider");
  return c;
};

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [settings, setSettings] = useState<Settings | null>(null);

  const load = useCallback(async () => {
    const s = await api.get<Settings>("/api/admin/settings");
    setSettings({ ...DEFAULT_SETTINGS, ...s });
  }, []);

  useEffect(() => {
    load().catch(() => setSettings(DEFAULT_SETTINGS));
  }, [load]);

  const ctx = useMemo<Ctx | null>(() => {
    if (!settings) return null;
    const refresh = () => load().catch(() => toast("Couldn't refresh settings"));
    return {
      settings,
      update: (patch, message) => {
        setSettings((s) => (s ? { ...s, ...patch } : s));
        if (message) toast(message);
        api.put("/api/admin/settings", patch).catch(() => {
          toast("Couldn't save that change");
          refresh();
        });
      },
      refresh,
    };
  }, [settings, toast, load]);

  if (!ctx) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return <SettingsCtx.Provider value={ctx}>{children}</SettingsCtx.Provider>;
}
