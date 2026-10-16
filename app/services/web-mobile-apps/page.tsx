import type { Metadata } from "next";
import WebMobileAppsMarkup from "@/components/WebMobileAppsMarkup";

export const metadata: Metadata = {
  title: "West Midlands & UK App Development Company | TechClues",
  description:
    "We develop web and mobile apps for UK startups and SMEs: iOS, Android and web products made with React Native, Flutter and Next.js, built to perform well.",
  alternates: { canonical: "https://techclues.co.uk/services/web-mobile-apps" },
};

export default function Page() {
  return <WebMobileAppsMarkup />;
}
