import type { Metadata } from "next";
import MvpDevelopmentMarkup from "@/components/MvpDevelopmentMarkup";

export const metadata: Metadata = {
  title: "UK Startup MVP Development Services | TechClues",
  description:
    "MVP development for UK founders. We first put your idea in front of real users, then deliver a lean MVP in as little as 2–4 weeks at a price agreed up front, from Birmingham.",
  alternates: { canonical: "https://techclues.co.uk/services/mvp-development" },
};

export default function Page() {
  return <MvpDevelopmentMarkup />;
}
