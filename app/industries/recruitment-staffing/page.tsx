import type { Metadata } from "next";
import RecruitmentStaffingMarkup from "@/components/RecruitmentStaffingMarkup";

export const metadata: Metadata = {
  title: "Recruitment Software Development in the UK | Vebryx",
  description:
    "Recruitment software for UK agencies: job boards, candidate and client portals, smart matching, timesheets and workflow automation.",
  alternates: { canonical: "https://vebryx.co.uk/industries/recruitment-staffing" },
};

export default function Page() {
  return <RecruitmentStaffingMarkup />;
}
