import type { Metadata } from "next";
import IndustryManufacturingMarkup from "@/components/IndustryManufacturingMarkup";

export const metadata: Metadata = {
  title: "UK Manufacturing Software Development | TechClues",
  description:
    "Software for UK manufacturers, from production dashboards and maintenance and quality apps to inventory and supplier portals and IoT machine data.",
  alternates: { canonical: "https://techclues.co.uk/industries/industry-manufacturing" },
};

export default function Page() {
  return <IndustryManufacturingMarkup />;
}
