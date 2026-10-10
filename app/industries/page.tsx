import type { Metadata } from "next";
import IndustriesMarkup from "@/components/IndustriesMarkup";

export const metadata: Metadata = {
  title: "Industries We Serve | Sector Software & MVPs | Vebryx",
  description:
    "Software, MVPs and digital products for healthcare, logistics, retail, education, startups, recruitment, SaaS and manufacturing.",
  alternates: { canonical: "https://vebryx.co.uk/industries" },
};

export default function Page() {
  return <IndustriesMarkup />;
}
