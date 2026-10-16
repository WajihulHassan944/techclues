import type { Metadata } from "next";
import HealthcareMedicalMarkup from "@/components/HealthcareMedicalMarkup";

export const metadata: Metadata = {
  title: "UK Healthcare Software Development | TechClues",
  description:
    "Secure healthcare software development for UK clinics and health startups, including patient portals, telemedicine, EHR integration and healthcare apps.",
  alternates: { canonical: "https://techclues.co.uk/industries/healthcare-medical" },
};

export default function Page() {
  return <HealthcareMedicalMarkup />;
}
