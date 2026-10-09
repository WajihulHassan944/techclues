/** Options and pricing model for the MVP cost calculator (taken from the reference page's own logic). */

export type Option = { id: string; name: string; text: string; multiplier: number };
export type Feature = { id: string; name: string; baseCost: number; weeks: number };

export const goals: Option[] = [
  { id: "mvp", name: "Start with an MVP", text: "Test the idea with real users first.", multiplier: 1 },
  { id: "full", name: "Build a full product", text: "A complete platform, ready to scale.", multiplier: 1.5 },
  { id: "update", name: "Update a product", text: "Improve or extend what you have.", multiplier: 0.7 },
];

export const platforms: Option[] = [
  { id: "web", name: "Web app", text: "Works in every browser.", multiplier: 0.5 },
  { id: "mobile", name: "Mobile app", text: "iOS and Android.", multiplier: 1.2 },
  { id: "both", name: "Web + mobile", text: "Every screen, one product.", multiplier: 1.7 },
];

export const features: Feature[] = [
  { id: "auth", name: "Sign up & log in", baseCost: 600, weeks: 1 },
  { id: "onboarding", name: "User onboarding", baseCost: 450, weeks: 1 },
  { id: "payments", name: "Payments", baseCost: 700, weeks: 1 },
  { id: "subscriptions", name: "Subscriptions", baseCost: 800, weeks: 1 },
  { id: "notifications", name: "Notifications", baseCost: 450, weeks: 1 },
  { id: "chat", name: "Real-time chat", baseCost: 1000, weeks: 1 },
  { id: "search", name: "Search & filters", baseCost: 550, weeks: 1 },
  { id: "uploads", name: "File & media uploads", baseCost: 500, weeks: 1 },
  { id: "booking", name: "Booking & scheduling", baseCost: 850, weeks: 1 },
  { id: "maps", name: "Maps & location", baseCost: 600, weeks: 1 },
  { id: "reviews", name: "Reviews & ratings", baseCost: 450, weeks: 1 },
  { id: "analytics", name: "Analytics", baseCost: 800, weeks: 1 },
  { id: "dashboard", name: "Dashboards & reports", baseCost: 900, weeks: 1 },
  { id: "ai", name: "AI features", baseCost: 1600, weeks: 1 },
  { id: "admin", name: "Admin panel", baseCost: 900, weeks: 1 },
  { id: "roles", name: "Roles & permissions", baseCost: 550, weeks: 1 },
  { id: "cms", name: "Content management", baseCost: 650, weeks: 1 },
  { id: "integrations", name: "API integrations", baseCost: 700, weeks: 1 },
];

export const paces: Option[] = [
  { id: "relaxed", name: "Relaxed", text: "2–3 months", multiplier: 0.6 },
  { id: "standard", name: "Standard", text: "1–2 months", multiplier: 0.7 },
  { id: "fast", name: "Fast track", text: "2–4 weeks", multiplier: 0.9 },
];

export type Answers = { goal: string; platform: string; features: string[]; pace: string };

const byId = <T extends { id: string }>(list: T[], id: string) => list.find((x) => x.id === id)!;
const FLOOR: Record<string, number> = { mvp: 5000, full: 10000, update: 0 };

export function estimate(a: Answers) {
  const base = a.features.reduce((sum, id) => sum + byId(features, id).baseCost, 0);
  const weeks = a.features.reduce((sum, id) => sum + byId(features, id).weeks, 0);
  const paceMultiplier = byId(paces, a.pace).multiplier;
  const setup = 2500 * Number(a.goal !== "update");
  const build = Math.round(base * (byId(platforms, a.platform).multiplier * byId(goals, a.goal).multiplier * paceMultiplier));
  const minBuild = setup + Math.round(0.85 * build);
  const topUp = a.features.length > 0 ? Math.max(0, FLOOR[a.goal] - minBuild) : 0;
  const w = Math.round((weeks * (a.platform === "both" ? 1 : 0.5)) / paceMultiplier);
  const minWeeks = Math.max(4, Math.round(0.8 * w));
  return {
    cost: setup + build + topUp,
    minCost: minBuild + topUp,
    maxCost: setup + Math.round(1.2 * build) + topUp,
    minWeeks,
    maxWeeks: Math.max(minWeeks, Math.round(1.3 * w)),
  };
}

export const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;
export const labelOf = {
  goal: (id: string) => byId(goals, id).name,
  platform: (id: string) => byId(platforms, id).name,
  pace: (id: string) => byId(paces, id).name,
  feature: (id: string) => byId(features, id).name,
};
