import type { Metadata } from "next";
import PrototypeToProductionMarkup from "@/components/PrototypeToProductionMarkup";

export const metadata: Metadata = {
  title: "Turn Your AI-Built App Into a Production-Ready Product | TechClues",
  description:
    "Used Lovable, Bolt, Replit or Cursor to build your app? We review it, sort out security, payments and hosting, and prepare it for launch. Audit £750, from West Midlands.",
  alternates: { canonical: "https://techclues.co.uk/services/prototype-to-production" },
};

export default function Page() {
  return <PrototypeToProductionMarkup />;
}
