import type { Metadata } from "next";
import PerformanceMarketingMarkup from "@/components/PerformanceMarketingMarkup";

export const metadata: Metadata = {
  title: "UK Startup Performance Marketing Agency | TechClues",
  description:
    "Performance marketing for UK startups, including waitlist and launch campaigns, paid social, Google Ads, landing page optimisation and transparent reporting.",
  alternates: { canonical: "https://techclues.co.uk/services/performance-marketing" },
};

export default function Page() {
  return <PerformanceMarketingMarkup />;
}
