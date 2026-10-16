import type { AccordionItem } from "@/components/Accordion";

/* Shown until the admin-managed "game-development" FAQ group has questions. */
export const fallbackFaqs: AccordionItem[] = [
  {
    q: "What game engines do you develop with?",
    a: "We work in Unity and Unreal Engine, with native VR and XR pipelines and UEFN development in Verse. Artwork is created in Blender and 3DS Max and delivered across mobile, PC and console.",
  },
  {
    q: "In what two ways can we work with your studio?",
    a: "Either as a dedicated extension of your team when you need extra delivery capacity, or as the studio behind your player-facing title when you want an idea built from start to finish.",
  },
  {
    q: "Can you build metaverse titles with genuine ownership mechanics?",
    a: "Yes. Our metaverse and MMO titles feature wallet sign-in, digital collectibles and ownable land, all tied into core gameplay loops.",
  },
  {
    q: "What does UEFN development involve, and is it something you do?",
    a: "UEFN, the Unreal Editor for Fortnite, allows studios to release custom games within Fortnite using Verse. We create bespoke islands through this pipeline.",
  },
  { q: "Is architectural visualisation something you offer beyond games?", a: "Yes. We produce real-time property tours and architectural walkthroughs using the same engines." },
  {
    q: "What does game development cost?",
    a: "The price varies with scope, platform and art fidelity. A prototype or vertical slice gives you a fixed, cheaper place to begin.",
  },
];
