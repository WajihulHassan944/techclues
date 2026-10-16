import type { Metadata } from "next";
import EducationConsultingMarkup from "@/components/EducationConsultingMarkup";

export const metadata: Metadata = {
  title: "Software Development for Edtech & Consulting in the UK | TechClues",
  description:
    "Custom software for UK educators, trainers and consultancies, covering learning platforms, client portals, bookings and scheduling, assessments and automated admin.",
  alternates: { canonical: "https://techclues.co.uk/industries/education-consulting" },
};

export default function Page() {
  return <EducationConsultingMarkup />;
}
