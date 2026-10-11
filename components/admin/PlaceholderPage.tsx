import type { ComponentType } from "react";
import { IconSpark } from "./icons";

export type Planned = { title: string; text: string; icon: ComponentType<{ className?: string }> };

export default function PlaceholderPage({ eyebrow, title, lead, planned }: { eyebrow: string; title: string; lead: string; planned: Planned[] }) {
  return (
    <>
      <div className="adm-hero">
        <div>
          <p className="adm-eyebrow">{eyebrow}</p>
          <h2 className="adm-title">{title}</h2>
          <p className="adm-lead">{lead}</p>
        </div>
        <span className="adm-chip">
          <IconSpark className="adm-ic" /> Coming in the next step
        </span>
      </div>
      <div className="adm-grid">
        {planned.map((p) => {
          const Icon = p.icon;
          return (
            <article key={p.title} className="adm-card">
              <span className="adm-card-ic">
                <Icon />
              </span>
              <h2>{p.title}</h2>
              <p>{p.text}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}
