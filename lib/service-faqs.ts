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
  "prototype-to-production": [
      {
          "q": "How much does it cost?",
          "a": "The code audit is £750, fixed. The hardening sprint starts from £3,500, and we fix its price at the end of the audit. Book the sprint and the audit fee comes off it."
      },
      {
          "q": "Which tools do you work with?",
          "a": "Apps built with Lovable, Bolt, Replit, Cursor, v0, Windsurf and similar, as well as code written with help from ChatGPT or Claude."
      },
      {
          "q": "Will you rebuild everything?",
          "a": "Only if it's the sensible option. We keep what's sound and fix what isn't, and the audit tells you which before you spend anything more."
      },
      {
          "q": "How long does it take?",
          "a": "The audit takes about a week. Most hardening sprints take 2–4 weeks, depending on what the audit finds."
      },
      {
          "q": "What do you need from me?",
          "a": "Access to the code and the accounts it runs on, such as GitHub, Supabase and your hosting, plus a quick walk-through of what the app should do."
      },
      {
          "q": "Can I keep building with AI tools afterwards?",
          "a": "Yes. We leave the code organised and tested, so you can carry on with AI tools or with us without breaking what's live."
      },
      {
          "q": "Who owns the code?",
          "a": "You do. The code, accounts and documentation stay yours."
      }
  ],
  "low-code-no-code": [
      {
          "q": "How much does it cost?",
          "a": "Launch starts from £2,500, Business from £5,000 and Advanced from £8,500. Your price is agreed before any work starts. Platform subscriptions are separate and sit in your name."
      },
      {
          "q": "Is low-code good enough for real users?",
          "a": "For many products and internal tools, yes. We'll tell you honestly when custom code is the better choice."
      },
      {
          "q": "Can we move to custom code later?",
          "a": "Yes. We design with that path in mind, so the switch is straightforward."
      },
      {
          "q": "Can my team maintain it?",
          "a": "Yes. We train your team and document how everything works."
      },
      {
          "q": "Which platforms do you use?",
          "a": "Bubble, Webflow, Softr, Shopify, Airtable, Supabase, Zapier, Make and n8n, chosen to fit what you need."
      },
      {
          "q": "Who pays for the platform?",
          "a": "Subscriptions sit in your name, so you own the account. We'll recommend the right plan."
      },
      {
          "q": "Is my data secure?",
          "a": "We use established platforms and set up user roles and permissions, so people only see what they should."
      }
  ],
};
