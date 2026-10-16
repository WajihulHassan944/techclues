import type { Metadata } from "next";
import StaffAugmentationMarkup from "@/components/StaffAugmentationMarkup";

export const metadata: Metadata = {
  title: "UK Staff Augmentation Services for Your Team | TechClues",
  description:
    "Vetted engineers and AI specialists join your team from the first day, which keeps architectural decisions and hard-won production knowledge inside your organisation.",
  alternates: { canonical: "https://techclues.co.uk/services/staff-augmentation" },
};

export default function Page() {
  return <StaffAugmentationMarkup />;
}
