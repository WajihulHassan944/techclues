import type { Metadata } from "next";
import LogisticsTransportationMarkup from "@/components/LogisticsTransportationMarkup";

export const metadata: Metadata = {
  title: "Logistics Software Development in the UK | Vebryx",
  description:
    "Logistics software for UK operators: fleet and transport management, warehouse systems, route optimisation and last-mile delivery apps.",
  alternates: { canonical: "https://vebryx.co.uk/industries/logistics-transportation" },
};

export default function Page() {
  return <LogisticsTransportationMarkup />;
}
