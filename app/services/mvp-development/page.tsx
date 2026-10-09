import type { Metadata } from "next";
import MvpDevelopmentMarkup from "@/components/MvpDevelopmentMarkup";

export const metadata: Metadata = {
  title: "MVP Development Services for UK Startups | Vebryx",
  description:
    "MVP development for UK founders. We test your idea with real users, then build a lean MVP in as little as 2–4 weeks, price agreed up front, from Glasgow.",
  alternates: { canonical: "https://vebryx.co.uk/services/mvp-development" },
};

export default function Page() {
  return <MvpDevelopmentMarkup />;
}
