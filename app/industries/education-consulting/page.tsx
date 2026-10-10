import type { Metadata } from "next";
import EducationConsultingMarkup from "@/components/EducationConsultingMarkup";

export const metadata: Metadata = {
  title: "Edtech & Consulting Software Development UK | Vebryx",
  description:
    "Software for UK educators, trainers and consultancies: learning platforms, client portals, booking and scheduling, assessments and admin automation.",
  alternates: { canonical: "https://vebryx.co.uk/industries/education-consulting" },
};

export default function Page() {
  return <EducationConsultingMarkup />;
}
