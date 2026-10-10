import type { Metadata } from "next";
import CareersMarkup from "@/components/CareersMarkup";

export const metadata: Metadata = {
  title: "Careers at Vebryx | Product Studio in Glasgow & Karachi",
  description:
    "Work with Vebryx, the MVP studio in Glasgow with a production studio in Karachi. See open roles, or send us your details and the work you&#x27;d like to do.",
  alternates: { canonical: "https://vebryx.co.uk/careers" },
};

export default function Page() {
  return <CareersMarkup />;
}
