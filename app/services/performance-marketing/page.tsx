import type { Metadata } from "next";
import PerformanceMarketingMarkup from "@/components/PerformanceMarketingMarkup";

export const metadata: Metadata = {
  title: "Performance Marketing Agency for UK Startups | Vebryx",
  description:
    "Performance marketing for UK startups: waitlist and launch campaigns, paid social and Google Ads, landing page optimisation and clear reporting.",
  alternates: { canonical: "https://vebryx.co.uk/services/performance-marketing" },
};

export default function Page() {
  return <PerformanceMarketingMarkup />;
}
