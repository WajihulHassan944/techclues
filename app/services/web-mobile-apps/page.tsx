import type { Metadata } from "next";
import WebMobileAppsMarkup from "@/components/WebMobileAppsMarkup";

export const metadata: Metadata = {
  title: "App Development Company in Glasgow & the UK | Vebryx",
  description:
    "Web and mobile app development for UK startups and SMEs. iOS, Android and web apps built with React Native, Flutter and Next.js, designed to perform.",
  alternates: { canonical: "https://vebryx.co.uk/services/web-mobile-apps" },
};

export default function Page() {
  return <WebMobileAppsMarkup />;
}
