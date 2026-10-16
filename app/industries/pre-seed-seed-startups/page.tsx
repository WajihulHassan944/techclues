import type { Metadata } from "next";
import PreSeedSeedStartupsMarkup from "@/components/PreSeedSeedStartupsMarkup";

export const metadata: Metadata = {
  title: "Building Products for Pre-seed & Seed Startups | TechClues",
  description:
    "We help UK pre-seed and seed founders validate quickly, build lean and demonstrate the traction investors want to see, with the price agreed up front.",
  alternates: { canonical: "https://techclues.co.uk/industries/pre-seed-seed-startups" },
};

export default function Page() {
  return <PreSeedSeedStartupsMarkup />;
}
