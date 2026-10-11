import type { Metadata } from "next";
import RetailEcommerceMarkup from "@/components/RetailEcommerceMarkup";

export const metadata: Metadata = {
  title: "Ecommerce & Retail Software Development UK | TechClues",
  description:
    "Ecommerce development for UK retailers: custom storefronts, marketplaces, checkout and payments, inventory and order tools, loyalty and retail apps.",
  alternates: { canonical: "https://techclues.co.uk/industries/retail-ecommerce" },
};

export default function Page() {
  return <RetailEcommerceMarkup />;
}
