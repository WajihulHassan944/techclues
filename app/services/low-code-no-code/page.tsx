import type { Metadata } from "next";
import LowCodeNoCodeMarkup from "@/components/LowCodeNoCodeMarkup";

export const metadata: Metadata = {
  title: "No-Code & Low-Code Development Agency UK | Vebryx",
  description:
    "No-code and low-code development for UK startups. Launch a working MVP or internal tool in days on Bubble, Webflow or Softr, with automations built in.",
  alternates: { canonical: "https://vebryx.co.uk/services/low-code-no-code" },
};

export default function Page() {
  return <LowCodeNoCodeMarkup />;
}
