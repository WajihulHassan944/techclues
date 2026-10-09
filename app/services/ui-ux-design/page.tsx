import type { Metadata } from "next";
import UiUxDesignMarkup from "@/components/UiUxDesignMarkup";

export const metadata: Metadata = {
  title: "UI/UX Design & Prototyping Agency in Glasgow | Vebryx",
  description:
    "UI/UX design for UK startups and product teams: user research, wireframes and clickable Figma prototypes, tested with real users before development.",
  alternates: { canonical: "https://vebryx.co.uk/services/ui-ux-design" },
};

export default function Page() {
  return <UiUxDesignMarkup />;
}
