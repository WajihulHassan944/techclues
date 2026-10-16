import type { Metadata } from "next";
import LogisticsTransportationMarkup from "@/components/LogisticsTransportationMarkup";

export const metadata: Metadata = {
  title: "UK Logistics Software Development | TechClues",
  description:
    "Software for UK logistics operators, covering fleet and transport management, warehouse systems, route optimisation and last-mile delivery apps.",
  alternates: { canonical: "https://techclues.co.uk/industries/logistics-transportation" },
};

export default function Page() {
  return <LogisticsTransportationMarkup />;
}
