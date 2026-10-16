import type { Metadata } from "next";
import IndustriesMarkup from "@/components/IndustriesMarkup";

export const metadata: Metadata = {
  title: "Sectors We Work In | Industry Software & MVPs | TechClues",
  description:
    "We build software, MVPs and digital products across healthcare, logistics, retail, education, startups, recruitment, SaaS and manufacturing.",
  alternates: { canonical: "https://techclues.co.uk/industries" },
};

export default function Page() {
  return <IndustriesMarkup />;
}
