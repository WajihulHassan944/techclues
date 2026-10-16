import type { Metadata } from "next";
import ServicesMarkup from "@/components/ServicesMarkup";

export const metadata: Metadata = {
  title: "Our Services | MVP Development, Apps, Design & Growth | TechClues",
  description:
    "UK startups get MVP development, AI integration, web and mobile apps, UI/UX design, no-code, branding and performance marketing, all from a single West Midlands team.",
  alternates: { canonical: "https://techclues.co.uk/services" },
};

export default function Page() {
  return <ServicesMarkup />;
}
