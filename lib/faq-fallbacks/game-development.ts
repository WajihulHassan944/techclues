import type { AccordionItem } from "@/components/Accordion";

/* Shown until the admin-managed "game-development" FAQ group has questions. */
export const fallbackFaqs: AccordionItem[] = [
  {
    q: "What game engines do you develop with?",
    a: "Unity and Unreal Engine, with native pipelines for VR and XR and UEFN using Verse. Art is produced in Blender and 3DS Max, shipped cross-platform across mobile, PC and console.",
  },
  {
    q: "What are the two ways to work with your studio?",
    a: "As a dedicated extension of your team when you need delivery power, or as the studio behind your player-facing title when you need an idea built end to end.",
  },
  {
    q: "Do you build metaverse titles with real ownership mechanics?",
    a: "Yes. We build metaverse and MMO titles with wallet sign-in, digital collectibles and ownable land wired into real gameplay loops.",
  },
  {
    q: "What is UEFN development, and do you build for it?",
    a: "UEFN, the Unreal Editor for Fortnite, lets studios publish custom games inside Fortnite using Verse. We build bespoke islands using this pipeline.",
  },
  { q: "Do you do architectural visualisation outside of games?", a: "Yes. We deliver real-time property tours and architectural walkthroughs built on the same engines." },
  {
    q: "How much does game development cost?",
    a: "Cost depends on scope, platform and art fidelity. A prototype or vertical slice is a fixed, lower-cost starting point.",
  },
];
