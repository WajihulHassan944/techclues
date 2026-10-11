import type { Metadata } from "next";
import EcommerceMarketplaceDevelopmentMarkup from "@/components/EcommerceMarketplaceDevelopmentMarkup";

export const metadata: Metadata = {
  title: "E-commerce & Marketplace Development UK | TechClues",
  description:
    "E-commerce and marketplace development for UK businesses: Shopify, WooCommerce and custom stores, and multi-vendor marketplaces. Stores from £1,000.",
  alternates: { canonical: "https://techclues.co.uk/services/ecommerce-marketplace-development" },
};

export default function Page() {
  return <EcommerceMarketplaceDevelopmentMarkup />;
}
