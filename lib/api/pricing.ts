import { DEFAULT_CALCULATOR_PRICING, type CalculatorPricing } from "@/lib/calculator";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type BuildOnePrice = { amount: number; durationLabel: string };
const DEFAULT_BUILD_ONE_PRICE: BuildOnePrice = { amount: 499, durationLabel: "7 days" };

/** Server-side fetch for public pricing (MVP calculator model + BUILD.ONE price) — falls back to
 *  the frontend's own hardcoded defaults if the API is unreachable, so pages never break. */
export async function getPublicPricing(): Promise<{ calculator: CalculatorPricing; buildOne: BuildOnePrice }> {
  try {
    const res = await fetch(`${API_URL}/api/public/pricing`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    return {
      calculator: data.calculator?.features?.length ? data.calculator : DEFAULT_CALCULATOR_PRICING,
      buildOne: data.buildOne?.amount ? data.buildOne : DEFAULT_BUILD_ONE_PRICE,
    };
  } catch {
    return { calculator: DEFAULT_CALCULATOR_PRICING, buildOne: DEFAULT_BUILD_ONE_PRICE };
  }
}
