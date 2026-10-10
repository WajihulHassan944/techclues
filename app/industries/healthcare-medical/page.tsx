import type { Metadata } from "next";
import HealthcareMedicalMarkup from "@/components/HealthcareMedicalMarkup";

export const metadata: Metadata = {
  title: "Healthcare Software Development in the UK | Vebryx",
  description:
    "Healthcare software development for UK clinics and health startups: patient portals, telemedicine, EHR integration and healthcare apps, built securely.",
  alternates: { canonical: "https://vebryx.co.uk/industries/healthcare-medical" },
};

export default function Page() {
  return <HealthcareMedicalMarkup />;
}
