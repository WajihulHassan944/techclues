import type { Metadata } from "next";
import SaasStartupsMarkup from "@/components/SaasStartupsMarkup";

export const metadata: Metadata = {
  title: "SaaS Development for UK Startups | TechClues",
  description:
    "SaaS development for UK startups: MVPs with accounts, teams, subscriptions and billing, dashboards, integrations and onboarding built to scale.",
  alternates: { canonical: "https://techclues.co.uk/industries/saas-startups" },
};

export default function Page() {
  return <SaasStartupsMarkup />;
}
