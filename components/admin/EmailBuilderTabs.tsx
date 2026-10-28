"use client";

import { useState } from "react";
import EmailBuilder from "./EmailBuilder";
import TransactionalEmails from "./TransactionalEmails";

type Tab = "campaigns" | "transactional";

export default function EmailBuilderTabs() {
  const [tab, setTab] = useState<Tab>("campaigns");
  return (
    <section>
      <div className="adm-tabs" role="tablist" style={{ marginBottom: 20 }}>
        <button type="button" role="tab" aria-selected={tab === "campaigns"} className="adm-tab" onClick={() => setTab("campaigns")}>
          Campaigns
        </button>
        <button type="button" role="tab" aria-selected={tab === "transactional"} className="adm-tab" onClick={() => setTab("transactional")}>
          Transactional emails
        </button>
      </div>
      {tab === "campaigns" ? <EmailBuilder /> : <TransactionalEmails />}
    </section>
  );
}
