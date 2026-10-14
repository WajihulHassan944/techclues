import type { AccordionItem } from "@/components/Accordion";

/* Shown until the admin-managed "staff-augmentation" FAQ group has questions. */
export const fallbackFaqs: AccordionItem[] = [
  {
    q: "How is this different from a full project outsourcing engagement?",
    a: "You keep full ownership of the roadmap and management; we add engineering capacity into your existing team rather than taking over delivery.",
  },
  { q: "How fast can someone start?", a: "Typically within a few weeks from scoping to start date, depending on the specialisation required." },
  {
    q: "Can we interview candidates before they join?",
    a: "Yes, we share matched candidates for your approval before onboarding. Team size or roles can also flex as your roadmap shifts.",
  },
  { q: "Do you handle payroll and employment, or do we?", a: "TechClues handles employment, payroll, and benefits; you manage day-to-day work." },
  { q: "Can this scale up or down as our project changes?", a: "Yes, headcount flexes with your roadmap without a hiring or layoff cycle on your end." },
  {
    q: "Who owns the code, models, and IP built by embedded engineers?",
    a: "You do. All code, AI models, and data pipelines built during the engagement belong to your organisation.",
  },
  {
    q: "What is the difference between nearshore, onshore, and offshore?",
    a: "Nearshore gives close time zone overlap at lower cost than onshore; onshore puts engineers in your own region; offshore operates from our global delivery centres as a cost-efficient extension of your team.",
  },
];
