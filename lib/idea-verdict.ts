import { estimate, features as FEATURES } from "./calculator";

export type Option = { id: string; label: string; hint?: string };
export type Verdict = "strong" | "watch" | "risk";
export type Answers = { idea: string; customer: string; customerDetail: string; alternatives: string; problem: string; edge: string; features: string[] };
export type Section = { title: string; verdict: Verdict; text: string };
export type Report = { score: number; headline: string; summary: string; sections: Section[]; questions: string[]; cost: { min: number; max: number } | null };

export const CUSTOMERS: Option[] = [
  { id: "role", label: "A particular job role", hint: "e.g. clinic managers, fleet supervisors" },
  { id: "industry", label: "A single industry or sector" },
  { id: "habit", label: "People with a particular habit", hint: "e.g. runners who race monthly" },
  { id: "everyone", label: "Nearly everyone" },
];
export const ALTERNATIVES: Option[] = [
  { id: "manual", label: "Spreadsheets and hands-on effort" },
  { id: "competitors", label: "Well-established rivals" },
  { id: "platforms", label: "Large platforms already in daily use" },
  { id: "nothing", label: "Nothing that I know of" },
];
export const PROBLEMS: Option[] = [
  { id: "costly", label: "It costs them money or exposes them to risk", hint: "Lost revenue, fines, churn" },
  { id: "annoying", label: "It irritates them every day" },
  { id: "nice", label: "It would be a pleasant extra" },
];
export const EDGES: Option[] = [
  { id: "niche", label: "Properly built for a single niche" },
  { id: "experience", label: "A much better experience" },
  { id: "faster", label: "Quicker or more automated" },
  { id: "cheaper", label: "Lower priced than the alternatives" },
  { id: "tech", label: "Newer technology, such as AI" },
  { id: "unsure", label: "To be honest, I am not sure yet" },
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
    sections.push({ title: "Intended customer", verdict: "risk", text: "“Nearly everyone” is the commonest way for an MVP to die. A wide audience brings fuzzy messaging, costly marketing and a product that suits nobody in particular. Choose the tightest group that feels the problem most, launch to them, and broaden afterwards." });
    questions.push("Which one group feels this problem most, and where could you find 20 of them this month?");
  } else {
    sections.push({ title: "Intended customer", verdict: "strong", text: `Targeting ${labelOf(CUSTOMERS, a.customer).toLowerCase()} gives you something workable to start with${detail ? ` (${detail})` : ""}. What matters now is whether you can reach them cheaply and again and again, instead of one by one through your own contacts.` });
    questions.push("Where do these people already spend time together, and could you reach 50 of them without buying ads?");
  }

  if (a.alternatives === "nothing") {
    score += 2;
    sections.push({ title: "Current alternatives", verdict: "risk", text: "When nothing exists, you have either found an untouched market or people simply do not care enough to pay for a fix. The latter happens far more often. Some alternative always exists, even if it is a spreadsheet, a WhatsApp group or putting up with the problem." });
    questions.push("How do people cope with this problem now, and what does that workaround cost them?");
  } else if (a.alternatives === "platforms" || a.alternatives === "competitors") {
    score += 1;
    sections.push({ title: "Current alternatives", verdict: "watch", text: `Going up against ${labelOf(ALTERNATIVES, a.alternatives).toLowerCase()} is routine, and it shows demand is real. The danger lies in switching costs: people seldom move unless the benefit is clear and instant. You need a reason to switch that fits in a single sentence.` });
    questions.push("What would make someone drop their current tool, and what would they have to leave behind?");
  } else {
    sections.push({ title: "Current alternatives", verdict: "strong", text: "Taking over from spreadsheets and hands-on effort is among the safest ways in. The work already happens, so the value is simple to measure in hours or mistakes avoided." });
    questions.push("How many hours each week does the manual approach eat up, and what are those hours worth to them?");
  }

  if (a.problem === "nice") {
    score += 3;
    sections.push({ title: "Central problem", verdict: "risk", text: "“Pleasant extra” products attract warm feedback and zero sales. People pay to stop losing money, time or customers. When the problem is not painful enough to have a budget behind it, the product will struggle however well it is built." });
    questions.push("Who already holds a budget for this, and which line does it come from?");
  } else if (a.problem === "annoying") {
    score += 1;
    sections.push({ title: "Central problem", verdict: "watch", text: "A daily irritation can become a genuine business, but only if it happens often enough that people still recall it when an invoice lands. Attach a figure to it: minutes lost each day, errors each week, customers lost each month." });
    questions.push("What does this irritation cost, in hours or money, every month?");
  } else {
    sections.push({ title: "Central problem", verdict: "strong", text: "A problem that costs money or brings risk is the strongest base you can have. Buyers can defend the spend inside their company, and you can set your price against the cost of inaction." });
    questions.push("Can you put a number on the problem in one sentence that a buyer would accept?");
  }

  if (a.edge === "unsure") {
    score += 2;
    sections.push({ title: "What sets you apart", verdict: "risk", text: "With no clear edge, you are asking people to gamble on an unknown for no visible reward. You can fix this, and fixing it now costs less than after launch: choose one thing to be clearly better at." });
  } else if (a.edge === "cheaper") {
    score += 2;
    sections.push({ title: "What sets you apart", verdict: "risk", text: "Lower pricing is the simplest edge to copy and the toughest to survive on. A well-funded rival can undercut you overnight, and customers who come for price leave first. Combine it with something harder to imitate." });
  } else if (a.edge === "tech") {
    score += 1;
    sections.push({ title: "What sets you apart", verdict: "watch", text: "New technology is a feature, not an advantage. AI especially is open to your competitors on identical terms. What counts is the particular job it does better, plus the data or workflow you hold that others lack." });
  } else {
    sections.push({ title: "What sets you apart", verdict: "strong", text: `“${labelOf(EDGES, a.edge)}” is a defensible place to begin, since it rests on a choice that competitors have decided not to make. Keep it precise enough that a customer could say it back to you.` });
  }
  questions.push("What would a customer say you do better, using their words and not yours?");

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
    sections.push({ title: "MVP scope", verdict: "risk", text: `${picked.length} features makes a full product, not a minimum viable one. Each feature adds build time, testing and one more thing to explain. Select the single feature that proves people want this, and keep the rest for version two.` });
  } else if (picked.length >= 3 || heavy.length > 0) {
    score += 1;
    const names = heavy.map((f) => FEATURES.find((x) => x.id === f)?.name.toLowerCase()).join(" and ");
    sections.push({ title: "MVP scope", verdict: "watch", text: `This is a workable first scope, although ${heavy.length ? `${names} adds noticeable cost and testing` : "every extra feature pushes your launch back"}. Ask about each one: without it, would the test still be valid?` });
  } else {
    sections.push({ title: "MVP scope", verdict: "strong", text: "A compact scope. Your instinct is right: the smaller the first version, the faster real users tell you whether the idea works." });
  }

  const risks: string[] = [];
  if (picked.includes("payments")) risks.push("accepting payments means handling compliance, refunds and disputes from the first day");
  if (picked.includes("ai")) risks.push("AI features cost money each time they run and need accuracy checks, so both grow as you succeed");
  if (picked.includes("chat")) risks.push("real-time chat is among the costliest features to build well and to moderate");
  if (a.customer === "everyone") risks.push("a wide audience makes paid acquisition pricey before your message is proven");
  if (a.alternatives === "platforms") risks.push("the platform you are up against could add your feature as a simple tick box");
  if (a.alternatives === "nothing") risks.push("having no existing alternative usually means no existing budget");
  if (a.edge === "cheaper") risks.push("competing on price leaves thin margins to pay for growth");
  if (risks.length === 0) risks.push("the main risk is the usual one: building more than you need before anyone has paid");
  sections.push({ title: "Possible risks", verdict: risks.length > 2 ? "risk" : "watch", text: `${risks.slice(0, 3).map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(". ")}.` });
  questions.push("What is the smallest thing you could show people this month to test this?");
  questions.push("What result would persuade you to stop, rather than simply carry on?");

  score = Math.min(10, score);
  const headline = score <= 2 ? "Your idea held up." : score <= 5 ? "Bruised, but still upright." : "This is the one we would kill first.";
  const summary =
    score <= 2
      ? "Nothing here is fatal. What remains open is reach and proof, and that is exactly what two weeks of validation should settle."
      : score <= 5
        ? "There is something genuine here, yet a few assumptions could sink it. Test them before building anything substantial."
        : "As described, this would be a costly way to learn what a fortnight of validation could reveal. That is not a refusal; it is a different first step.";
  return { score, headline, summary, sections, questions, cost };
}
