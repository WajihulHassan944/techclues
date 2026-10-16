import type { Metadata } from "next";
import RecruitmentStaffingMarkup from "@/components/RecruitmentStaffingMarkup";

export const metadata: Metadata = {
  title: "UK Recruitment Software Development | TechClues",
  description:
    "Software for UK recruitment agencies, including job boards, candidate and client portals, intelligent matching, timesheets and automated workflows.",
  alternates: { canonical: "https://techclues.co.uk/industries/recruitment-staffing" },
};

export default function Page() {
  return <RecruitmentStaffingMarkup />;
}
