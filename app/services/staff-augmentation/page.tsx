import type { Metadata } from "next";
import StaffAugmentationMarkup from "@/components/StaffAugmentationMarkup";

export const metadata: Metadata = {
  title: "Staff Augmentation Services for UK Teams | TechClues",
  description:
    "We embed vetted engineers and AI specialists inside your team from day one, so architectural decisions and production learning stay in your organisation.",
  alternates: { canonical: "https://techclues.co.uk/services/staff-augmentation" },
};

export default function Page() {
  return <StaffAugmentationMarkup />;
}
