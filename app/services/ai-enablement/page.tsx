import type { Metadata } from "next";
import AiEnablementMarkup from "@/components/AiEnablementMarkup";

export const metadata: Metadata = {
  title: "UK AI Integration Services for Businesses | TechClues",
  description:
    "We add AI to UK businesses through assistants, agents, document processing and automation that fit into the systems you already run. Begin with a £1,500 AI audit.",
  alternates: { canonical: "https://techclues.co.uk/services/ai-enablement" },
};

export default function Page() {
  return <AiEnablementMarkup />;
}
