import type { Metadata } from "next";
import BrandStrategyMarkup from "@/components/BrandStrategyMarkup";

export const metadata: Metadata = {
  title: "West Midlands Branding Agency for Startups | TechClues",
  description:
    "Brand strategy and identity for UK startups, covering market research, positioning, messaging, logo and visual identity, plus guidelines your team can put to work.",
  alternates: { canonical: "https://techclues.co.uk/services/brand-strategy" },
};

export default function Page() {
  return <BrandStrategyMarkup />;
}
