import type { Metadata } from "next";
import ServicesMarkup from "@/components/ServicesMarkup";

export const metadata: Metadata = {
  title: "Services | MVP Development, Apps, Design & Growth | TechClues",
  description:
    "MVP development, AI integration, web and mobile apps, UI/UX design, no-code, branding and performance marketing for UK startups, from one Birmingham team.",
  alternates: { canonical: "https://techclues.co.uk/services" },
};

export default function Page() {
  return <ServicesMarkup />;
}
