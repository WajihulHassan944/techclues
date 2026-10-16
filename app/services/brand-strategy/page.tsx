import type { Metadata } from "next";
import BrandStrategyMarkup from "@/components/BrandStrategyMarkup";

export const metadata: Metadata = {
  title: "Branding Agency for Startups in West Midlands | TechClues",
  description:
    "Brand strategy and identity for UK startups: market research, positioning, messaging, logo and visual identity, with guidelines your team can use.",
  alternates: { canonical: "https://techclues.co.uk/services/brand-strategy" },
};

export default function Page() {
  return <BrandStrategyMarkup />;
}
