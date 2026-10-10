import type { Metadata } from "next";
import IndustryManufacturingMarkup from "@/components/IndustryManufacturingMarkup";

export const metadata: Metadata = {
  title: "Manufacturing Software Development in the UK | Vebryx",
  description:
    "Manufacturing software for UK firms: production dashboards, maintenance and quality apps, inventory and supplier portals, and IoT machine data.",
  alternates: { canonical: "https://vebryx.co.uk/industries/industry-manufacturing" },
};

export default function Page() {
  return <IndustryManufacturingMarkup />;
}
