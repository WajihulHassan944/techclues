import type { AccordionItem } from "@/components/Accordion";

/** FAQ content for each service page, keyed by slug. */
export const serviceFaqs: Record<string, AccordionItem[]> = {
  "mvp-development": [
      {
          "q": "How much does an MVP cost?",
          "a": "A Validation MVP starts from £2,500, a Lean MVP from £5,000 and a Custom or SaaS platform from £10,000. Your price is agreed before any work starts. Not ready for an MVP yet? ZERO.ONE builds and tests your core feature in a week for £499. Our cost calculator gives you an instant estimate."
      },
      {
          "q": "How long does it take?",
          "a": "A Validation MVP takes 1–2 weeks and a Lean MVP 2–4 weeks. A Custom or SaaS platform usually takes around 8 weeks."
      },
      {
          "q": "What if the idea doesn't validate?",
          "a": "Then you've saved months and most of your budget, and we'll help you work out what to test next."
      },
      {
          "q": "Do I need a technical co-founder?",
          "a": "No. We act as your product and engineering team from validation to launch, and can help you hire in-house when the time is right."
      },
      {
          "q": "Who owns the code?",
          "a": "You do. The code, designs and accounts are yours."
      },
      {
          "q": "What happens after launch?",
          "a": "We review the data with you, fix what users struggle with and plan the next release. You can carry on with us as an ongoing partner."
      }
  ],
};
