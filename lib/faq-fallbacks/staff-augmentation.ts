import type { AccordionItem } from "@/components/Accordion";

/* Shown until the admin-managed "staff-augmentation" FAQ group has questions. */
export const fallbackFaqs: AccordionItem[] = [
  {
    q: "How does this differ from outsourcing an entire project?",
    a: "The roadmap and management stay entirely with you. We add engineering capacity to your current team instead of taking delivery over.",
  },
  { q: "How quickly can someone begin?", a: "Usually a few weeks pass between scoping and the start date, depending on the specialism you need." },
  {
    q: "Can we interview candidates first?",
    a: "Yes, matched candidates come to you for approval before onboarding. You can also adjust team size or roles as your roadmap changes.",
  },
  { q: "Who looks after payroll and employment, you or us?", a: "TechClues takes care of employment, payroll, and benefits, and you direct the daily work." },
  { q: "Can the team grow or shrink as our project evolves?", a: "Yes, headcount follows your roadmap, and you never have to go through hiring or redundancies yourself." },
  {
    q: "Who owns the code, models, and IP that embedded engineers create?",
    a: "You do. Every piece of code, every AI model, and all data pipelines produced during the engagement are your organisation's.",
  },
  {
    q: "How do nearshore, onshore, and offshore differ?",
    a: "Nearshore offers strong time zone overlap at a lower cost than onshore. Onshore places engineers in your own region. Offshore works from our global delivery centres as an economical extension of your team.",
  },
];
