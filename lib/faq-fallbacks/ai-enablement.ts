import type { AccordionItem } from "@/components/Accordion";

/* Shown until the admin-managed "ai-enablement" FAQ group has questions. */
export const fallbackFaqs: AccordionItem[] = [
  {
    q: "Do you build AI features into an existing product, or only new ones?",
    a: "Both. Most of our AI work goes into products that already exist — a chatbot added to a support flow, automation bolted onto an existing process. We also build AI-native products from scratch when that's the brief.",
  },
  {
    q: "What happens if the model gets something wrong?",
    a: "Every AI feature we ship has a defined fallback: a human handoff, a confidence threshold that stops it acting, or a review step before anything irreversible happens. We don't wire a model directly into production without a safety net.",
  },
  {
    q: "Which AI providers do you work with?",
    a: "We're not tied to one vendor — OpenAI, Anthropic, Google and open-weight models, chosen per task on cost, latency and data-handling grounds rather than habit.",
  },
  {
    q: "Can you work with our existing data without sending it to a third party?",
    a: "Yes. Depending on your constraints we can run models inside your own cloud, use providers with zero-retention agreements, or keep certain data processing entirely on-premises.",
  },
  {
    q: "How do you measure whether an AI feature is actually working?",
    a: "Before anything ships we define what success looks like — resolution rate, time saved, accuracy against a labelled set — and build an eval suite around it, so you're not guessing after launch.",
  },
];
