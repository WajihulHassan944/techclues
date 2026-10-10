import type { Metadata } from "next";
import PreSeedSeedStartupsMarkup from "@/components/PreSeedSeedStartupsMarkup";

export const metadata: Metadata = {
  title: "Product Development for Pre-seed & Seed Startups | Vebryx",
  description:
    "Product development for UK pre-seed and seed founders: validate fast, build lean and show the traction investors look for, price agreed up front.",
  alternates: { canonical: "https://vebryx.co.uk/industries/pre-seed-seed-startups" },
};

export default function Page() {
  return <PreSeedSeedStartupsMarkup />;
}
