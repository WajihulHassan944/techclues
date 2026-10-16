import type { Metadata } from "next";
import UiUxDesignMarkup from "@/components/UiUxDesignMarkup";

export const metadata: Metadata = {
  title: "West Midlands UI/UX Design & Prototyping Agency | TechClues",
  description:
    "UI/UX design for UK startups and product teams, from user research and wireframes to clickable Figma prototypes that real users have tested before development starts.",
  alternates: { canonical: "https://techclues.co.uk/services/ui-ux-design" },
};

export default function Page() {
  return <UiUxDesignMarkup />;
}
