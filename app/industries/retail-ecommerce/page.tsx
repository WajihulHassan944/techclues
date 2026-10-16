import type { Metadata } from "next";
import RetailEcommerceMarkup from "@/components/RetailEcommerceMarkup";

export const metadata: Metadata = {
  title: "Retail & Ecommerce Software Development in the UK | TechClues",
  description:
    "Ecommerce development for UK retailers, covering bespoke storefronts, marketplaces, checkout and payments, inventory and order tools, and loyalty and retail apps.",
  alternates: { canonical: "https://techclues.co.uk/industries/retail-ecommerce" },
};

export default function Page() {
  return <RetailEcommerceMarkup />;
}
