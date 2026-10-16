import type { Metadata } from "next";
import LowCodeNoCodeMarkup from "@/components/LowCodeNoCodeMarkup";

export const metadata: Metadata = {
  title: "UK Agency for No-Code & Low-Code Development | TechClues",
  description:
    "UK startups can get a working MVP or internal tool live within days using no-code and low-code development on Bubble, Webflow or Softr, automations included.",
  alternates: { canonical: "https://techclues.co.uk/services/low-code-no-code" },
};

export default function Page() {
  return <LowCodeNoCodeMarkup />;
}
