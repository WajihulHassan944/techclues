import type { Metadata } from "next";
import SaasStartupsMarkup from "@/components/SaasStartupsMarkup";

export const metadata: Metadata = {
  title: "UK Startup SaaS Development | TechClues",
  description:
    "We build SaaS for UK startups: MVPs with user accounts, teams, subscriptions and billing, dashboards, integrations and onboarding, all designed to scale.",
  alternates: { canonical: "https://techclues.co.uk/industries/saas-startups" },
};

export default function Page() {
  return <SaasStartupsMarkup />;
}
