"use client";

import { useEffect, useState, type ComponentType } from "react";
import Assistants from "./generated/ai/AiPanelAssistants";
import Agents from "./generated/ai/AiPanelAgents";
import Knowledge from "./generated/ai/AiPanelKnowledge";
import Documents from "./generated/ai/AiPanelDocuments";
import Automation from "./generated/ai/AiPanelAutomation";
import Content from "./generated/ai/AiPanelContent";
import Voice from "./generated/ai/AiPanelVoice";
import Vision from "./generated/ai/AiPanelVision";
import Recommendations from "./generated/ai/AiPanelRecommendations";
import Custom from "./generated/ai/AiPanelCustom";

const PANELS: Record<string, ComponentType> = {
  assistants: Assistants,
  agents: Agents,
  knowledge: Knowledge,
  documents: Documents,
  automation: Automation,
  content: Content,
  voice: Voice,
  vision: Vision,
  recommendations: Recommendations,
  custom: Custom,
};

/** Shows the panel for whichever AI capability radio is selected. */
export default function AiPanel() {
  const [value, setValue] = useState("assistants");

  useEffect(() => {
    const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="ai-integration"]'));
    const checked = radios.find((r) => r.checked);
    if (checked) setValue(checked.value);
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (t.checked && PANELS[t.value]) setValue(t.value);
    };
    radios.forEach((r) => r.addEventListener("change", onChange));
    return () => radios.forEach((r) => r.removeEventListener("change", onChange));
  }, []);

  const Panel = PANELS[value] ?? Assistants;
  return <Panel key={value} />;
}
