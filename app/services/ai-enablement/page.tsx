import type { Metadata } from "next";
import AiEnablementMarkup from "@/components/AiEnablementMarkup";

export const metadata: Metadata = {
  title: "AI Integration Services for UK Businesses | TechClues",
  description:
    "AI integration for UK businesses: assistants, agents, document processing and automation, built into the systems you already use. Start with a £1,500 AI audit.",
  alternates: { canonical: "https://techclues.co.uk/services/ai-enablement" },
};

export default function Page() {
  return <AiEnablementMarkup />;
}
