import type { Metadata } from "next";
import EcommerceMarketplaceDevelopmentMarkup from "@/components/EcommerceMarketplaceDevelopmentMarkup";

export const metadata: Metadata = {
  title: "UK E-commerce & Marketplace Development | TechClues",
  description:
    "We build e-commerce stores and marketplaces for UK businesses, including Shopify, WooCommerce, custom stores and multi-vendor marketplaces. Stores from £1,000.",
  alternates: { canonical: "https://techclues.co.uk/services/ecommerce-marketplace-development" },
};

export default function Page() {
  return <EcommerceMarketplaceDevelopmentMarkup />;
}
