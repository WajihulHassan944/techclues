import { estimate, features as FEATURES } from "./calculator";

export type Option = { id: string; label: string; hint?: string };
export type Verdict = "strong" | "watch" | "risk";
export type Answers = { idea: string; customer: string; customerDetail: string; alternatives: string; problem: string; edge: string; features: string[] };
export type Section = { title: string; verdict: Verdict; text: string };
export type Report = { score: number; headline: string; summary: string; sections: Section[]; questions: string[]; cost: { min: number; max: number } | null };

export const CUSTOMERS: Option[] = [
  { id: "role", label: "A specific job role", hint: "e.g. clinic managers, fleet supervisors" },
  { id: "industry", label: "One industry or sector" },
  { id: "habit", label: "People with a specific habit", hint: "e.g. runners who race monthly" },
  { id: "everyone", label: "Almost everyone" },
];
export const ALTERNATIVES: Option[] = [
  { id: "manual", label: "Spreadsheets and manual work" },
  { id: "competitors", label: "Established competitors" },
  { id: "platforms", label: "Big platforms people already use" },
  { id: "nothing", label: "Nothing, as far as I know" },
];
export const PROBLEMS: Option[] = [
  { id: "costly", label: "It costs them money or risk", hint: "Lost revenue, fines, churn" },
  { id: "annoying", label: "It's a daily annoyance" },
  { id: "nice", label: "It would be nice to have" },
];
export const EDGES: Option[] = [
  { id: "niche", label: "Built for one niche properly" },
  { id: "experience", label: "A far better experience" },
  { id: "faster", label: "Faster or more automated" },
  { id: "cheaper", label: "Cheaper than the alternatives" },
  { id: "tech", label: "New technology, such as AI" },
  { id: "unsure", label: "Honestly, not sure yet" },
];
export const FEATURE_CHOICES = FEATURES.map((f) => ({ id: f.id, name: f.name }));

export const INITIAL: Answers = { idea: "", customer: "role", customerDetail: "", alternatives: "manual", problem: "costly", edge: "niche", features: [] };

const labelOf = (list: Option[], id: string) => list.find((o) => o.id === id)?.label ?? "";

/** Scores the idea against the usual weak points and writes the verdict. */
export function buildReport(a: Answers): Report {
  const sections: Section[] = [];
  const questions: string[] = [];
  let score = 0;
  const detail = a.customerDetail.trim();

  if (a.customer === "everyone") {
    score += 3;
    sections.push({ title: "Target customer", verdict: "risk", text: "“Almost everyone” is the most common way an MVP dies. A broad audience means vague messaging, expensive marketing and a product that fits nobody in particular. Pick the narrowest group who feel the problem most, launch for them, and widen later." });
    questions.push("Which single group feels this problem most, and where do you find 20 of them this month?");
  } else {
    sections.push({ title: "Target customer", verdict: "strong", text: `Aiming at ${labelOf(CUSTOMERS, a.customer).toLowerCase()} is a workable starting point${detail ? ` (${detail})` : ""}. The test now is whether you can reach them cheaply and repeatedly, rather than one at a time through your own network.` });
    questions.push("Where do these people already gather, and can you reach 50 of them without paying for ads?");
  }

  if (a.alternatives === "nothing") {
    score += 2;
    sections.push({ title: "Existing alternatives", verdict: "risk", text: "If nothing exists, either you've found an untapped market or people don't care enough to pay for a fix. The second is far more common. There is always an alternative, even if it's a spreadsheet, a WhatsApp group or doing nothing." });
    questions.push("What do people do about this problem today, and what does that workaround cost them?");
  } else if (a.alternatives === "platforms" || a.alternatives === "competitors") {
    score += 1;
    sections.push({ title: "Existing alternatives", verdict: "watch", text: `Competing with ${labelOf(ALTERNATIVES, a.alternatives).toLowerCase()} is normal, and proves demand exists. The risk is switching costs: people rarely move unless the gain is obvious and immediate. You'll need a reason to switch that can be explained in one sentence.` });
    questions.push("Why would someone leave what they use today, and what would they have to give up?");
  } else {
    sections.push({ title: "Existing alternatives", verdict: "strong", text: "Replacing spreadsheets and manual work is one of the most reliable places to start. The work is already being done, so the value is easy to measure in hours or errors saved." });
    questions.push("How many hours a week does the manual version take, and what is that worth to them?");
  }

  if (a.problem === "nice") {
    score += 3;
    sections.push({ title: "Core problem", verdict: "risk", text: "“Nice to have” products get enthusiastic feedback and no purchases. People pay to stop losing money, time or customers. If the problem isn't painful enough to have a budget attached, the product will struggle no matter how well it's built." });
    questions.push("Who already has budget for this, and what line does it come out of?");
  } else if (a.problem === "annoying") {
    score += 1;
    sections.push({ title: "Core problem", verdict: "watch", text: "A daily annoyance can be a real business, but only if it's frequent enough that people remember it when a bill arrives. Tie the annoyance to a number: minutes lost per day, mistakes per week, customers lost per month." });
    questions.push("What does this annoyance cost in hours or money each month?");
  } else {
    sections.push({ title: "Core problem", verdict: "strong", text: "A problem that costs money or creates risk is the strongest foundation there is. Buyers can justify it internally, and you can price against the cost of doing nothing." });
    questions.push("Can you quantify the cost of the problem in a sentence a buyer would agree with?");
  }

  if (a.edge === "unsure") {
    score += 2;
    sections.push({ title: "Differentiation", verdict: "risk", text: "Without a clear edge, you're asking people to take a risk on an unknown for no obvious gain. This is fixable, and it's cheaper to fix now than after launch: pick one thing to be unmistakably better at." });
  } else if (a.edge === "cheaper") {
    score += 2;
    sections.push({ title: "Differentiation", verdict: "risk", text: "Being cheaper is the easiest edge to copy and the hardest to survive. A funded competitor can undercut you overnight, and price-led customers leave the fastest. Pair it with something harder to copy." });
  } else if (a.edge === "tech") {
    score += 1;
    sections.push({ title: "Differentiation", verdict: "watch", text: "New technology is a feature, not an edge. AI in particular is now available to your competitors on the same terms. What matters is the specific job it does better, and the data or workflow you have that others don't." });
  } else {
    sections.push({ title: "Differentiation", verdict: "strong", text: `“${labelOf(EDGES, a.edge)}” is a defensible starting point, because it's built on a decision competitors have chosen not to make. Keep it specific enough that a customer could repeat it back to you.` });
  }
  questions.push("What would a customer say you do better, in their words rather than yours?");

  const picked = a.features;
  const heavy = picked.filter((f) => f === "chat" || f === "ai" || f === "payments");
  const cost = picked.length
    ? (() => {
        const e = estimate({ goal: "mvp", platform: "web", features: picked, pace: "standard" });
        return { min: e.minCost, max: e.maxCost };
      })()
    : null;

  if (picked.length >= 5) {
    score += 2;
    sections.push({ title: "MVP complexity", verdict: "risk", text: `${picked.length} features is a product, not a minimum viable one. Every feature adds build time, testing and something else to explain. Pick the one feature that proves people want this, and leave the rest for version two.` });
  } else if (picked.length >= 3 || heavy.length > 0) {
    score += 1;
    const names = heavy.map((f) => FEATURES.find((x) => x.id === f)?.name.toLowerCase()).join(" and ");
    sections.push({ title: "MVP complexity", verdict: "watch", text: `A workable first scope, though ${heavy.length ? `${names} adds meaningful cost and testing` : "each extra feature pushes your launch further out"}. Ask of each one: if this were missing, would the test still be valid?` });
  } else {
    sections.push({ title: "MVP complexity", verdict: "strong", text: "A tight scope. This is the right instinct: the smaller the first version, the sooner real users tell you whether the idea holds." });
  }

  const risks: string[] = [];
  if (picked.includes("payments")) risks.push("taking payments brings compliance, refunds and disputes to handle from day one");
  if (picked.includes("ai")) risks.push("AI features cost money per use and need checking for accuracy, so both scale with your success");
  if (picked.includes("chat")) risks.push("real-time chat is one of the most expensive features to build well and to moderate");
  if (a.customer === "everyone") risks.push("a broad audience makes paid acquisition expensive before you've proven the message");
  if (a.alternatives === "platforms") risks.push("the platform you're competing with could add your feature as a checkbox");
  if (a.alternatives === "nothing") risks.push("no existing alternative usually signals no existing budget");
  if (a.edge === "cheaper") risks.push("competing on price leaves little margin to fund growth");
  if (risks.length === 0) risks.push("the main risk is the ordinary one: building more than you need before anyone has paid");
  sections.push({ title: "Potential risks", verdict: risks.length > 2 ? "risk" : "watch", text: `${risks.slice(0, 3).map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(". ")}.` });
  questions.push("What's the smallest thing you could put in front of people this month to test this?");
  questions.push("What result would convince you to stop, not just to carry on?");

  score = Math.min(10, score);
  const headline = score <= 2 ? "Your idea survived." : score <= 5 ? "Wounded, but standing." : "We'd kill this one first.";
  const summary =
    score <= 2
      ? "Nothing here is fatal. The open questions are about reach and proof, which is exactly what a two-week validation should answer."
      : score <= 5
        ? "There's something real here, but a few assumptions could sink it. Test those before you build anything substantial."
        : "As described, this would be an expensive way to learn something a fortnight of validation could tell you. That's not a no; it's a different first step.";
  return { score, headline, summary, sections, questions, cost };
}
