"use client";

import Accordion from "./Accordion";

const FAQS = [
  { q: "How accurate is the calculator?", a: "It gives an estimated range based on the features, platform and pace you choose. It's a realistic starting point; the final cost depends on detailed requirements, integrations and custom work." },
  { q: "What affects the cost of an MVP?", a: "The number of core features, web or mobile, design complexity, third-party integrations such as payments or APIs, and your timeline. As these grow, so does the effort and the cost." },
  { q: "What is included in an MVP?", a: "Only the essentials needed to test your core idea: usually user accounts, the main functionality, a simple dashboard and any must-have integrations." },
  { q: "Can you help refine my idea?", a: "Yes. We work with founders to validate ideas, choose the right features and design an MVP that launches quickly within budget." },
  { q: "What should I do after getting my estimate?", a: "Refine your scope and plan your roadmap. Book a free call and we'll turn your estimate into a detailed plan and proposal." },
  { q: "Can the MVP grow into a full product?", a: "Yes. We build MVPs to scale, so once the idea is validated you can add features and integrations rather than start again." },
];

/** FAQ accordion for the calculator page. */
export default function CalcFaq() {
  return <Accordion items={FAQS} />;
}
