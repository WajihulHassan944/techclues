import type { Metadata } from "next";
import PrototypeToProductionMarkup from "@/components/PrototypeToProductionMarkup";

export const metadata: Metadata = {
  title: "Make Your AI-Built App Production-Ready | Vebryx",
  description:
    "Built your app with Lovable, Bolt, Replit or Cursor? We audit it, fix security, payments and hosting, and get it launch-ready. Audit £750, from Glasgow.",
  alternates: { canonical: "https://vebryx.co.uk/services/prototype-to-production" },
};

export default function Page() {
  return <PrototypeToProductionMarkup />;
}
