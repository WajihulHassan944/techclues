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
  "performance-marketing": [
      {
          "q": "How much do you charge?",
          "a": "Launch is £750 a month, Growth £1,250 a month and Scale from £2,000 a month. Your ad budget is separate from our fee."
      },
      {
          "q": "What budget do I need?",
          "a": "It depends on your goals and market. We'll recommend a starting budget and scale what works."
      },
      {
          "q": "How soon will I see results?",
          "a": "Early signals usually show within the first few weeks, then we optimise from there."
      },
      {
          "q": "Do you work with pre-launch products?",
          "a": "Yes. Waitlist campaigns are one of the best ways to validate demand."
      },
      {
          "q": "Which channels should I use?",
          "a": "The ones your customers use. We research your audience first, then test the most promising channels with small budgets."
      },
      {
          "q": "Do you create the ads?",
          "a": "Yes. We write the copy and design the creative, then test variations to find what works."
      },
      {
          "q": "How do you report results?",
          "a": "Clear reports showing spend, results and cost per acquisition, with recommendations for what to do next."
      }
  ],
  "web-mobile-apps": [
      {
          "q": "How much does an app cost?",
          "a": "Web apps start from £5,000 (Starter), £8,500 (Business) and £15,000 (Advanced). Mobile apps for iOS and Android start from £7,500, £12,500 and £20,000. Your price is agreed before any work starts."
      },
      {
          "q": "Do you build native or cross-platform apps?",
          "a": "Usually cross-platform with React Native or Flutter, so one codebase serves iOS and Android. We'll recommend native when it's genuinely needed."
      },
      {
          "q": "Can you take over an existing app?",
          "a": "Yes. We start with a code review, then fix, improve or rebuild depending on what's there."
      },
      {
          "q": "Will you publish to the App Store and Google Play?",
          "a": "Yes, we handle submission and review for both stores."
      },
      {
          "q": "Which technology do you recommend?",
          "a": "The one that fits your product, team and budget. We explain the options in plain English and recommend what will last, not what's trendy."
      },
      {
          "q": "How do you keep apps secure?",
          "a": "Encrypted connections, secure authentication, role-based access and regular dependency updates, with GDPR in mind from the start."
      },
      {
          "q": "Do you support apps after launch?",
          "a": "Yes. We offer ongoing maintenance, monitoring and new feature development."
      }
  ],
  "ecommerce-marketplace-development": [
      {
          "q": "How much does an online store or marketplace cost?",
          "a": "An online store starts at £1,000 (Basic, on Shopify, WooCommerce or custom-built), with Growth from £2,000 and Advanced from £3,500. A marketplace starts from £5,000 (Launch), with Growth from £8,500 and Scale from £15,000. Your price is agreed before any work starts."
      },
      {
          "q": "Are you a Shopify Partner?",
          "a": "Yes. Vebryx is a Shopify Partner. We design, build and set up Shopify stores, and build on WooCommerce or custom code where that fits you better."
      },
      {
          "q": "Should I use Shopify, WooCommerce or a custom build?",
          "a": "Shopify suits most shops that want to start selling quickly. WooCommerce suits businesses already on WordPress. A custom build makes sense for marketplaces and buying flows the platforms can't handle. We'll recommend one before we start."
      },
      {
          "q": "Can you build a multi-vendor marketplace?",
          "a": "Yes. Sellers can sign up, list their products and get paid, while you set the rules, approve listings and take a commission."
      },
      {
          "q": "Can you move my existing shop?",
          "a": "Usually, yes. We'll check what can move from your current platform, such as products, customers and orders, when we scope the work."
      },
      {
          "q": "Which payments can customers use?",
          "a": "Cards and digital wallets through providers such as Stripe, PayPal or Shopify Payments, set up for UK VAT."
      },
      {
          "q": "Who owns the store?",
          "a": "You do. The store, its content and your customer data are yours, and platform accounts are set up in your name."
      },
      {
          "q": "Can you help us get sales after launch?",
          "a": "Yes. Our performance marketing team runs paid social and Google Ads campaigns to bring in customers."
      }
  ],
  "ui-ux-design": [
      {
          "q": "How much does design cost?",
          "a": "Essential starts from £1,000, Product from £2,000 and Complete from £3,500. Your price is agreed before any work starts, and you own the design files."
      },
      {
          "q": "Do you only design, or build too?",
          "a": "Both. You can hire us for design only, or design and build together for a smoother handover."
      },
      {
          "q": "Will I own the design files?",
          "a": "Yes. You get the full Figma files and design system."
      },
      {
          "q": "How do you test designs?",
          "a": "With clickable prototypes and short sessions with real or target users."
      },
      {
          "q": "How long does design take?",
          "a": "It depends on scope. Design for a focused MVP fits inside the 2–4 week MVP timeline; larger products take longer."
      },
      {
          "q": "Do you follow accessibility standards?",
          "a": "Yes. We design to WCAG guidelines, covering contrast, type size, focus states and screen reader support."
      },
      {
          "q": "Can you work with our existing brand?",
          "a": "Yes. We'll extend your brand into a product design system, or refine it where it needs help."
      }
  ],
  "industries-healthcare-medical": [
      {
          "q": "Do you build to NHS and GDPR standards?",
          "a": "We design with GDPR and relevant NHS Digital standards in mind from day one, and plan compliance needs during discovery."
      },
      {
          "q": "Can you integrate with our existing systems?",
          "a": "Yes. We connect patient management, EHR/EMR and booking systems through their APIs or standard formats."
      },
      {
          "q": "Can you build a medical device app?",
          "a": "We can build the software and plan for MHRA guidance where it applies. Regulatory sign-off stays with you and your advisers."
      },
      {
          "q": "Can we start small?",
          "a": "Yes. Many healthcare products start with a focused MVP, such as online booking, and grow from there."
      }
  ],
  "industries-retail-ecommerce": [
      {
          "q": "Do you build on Shopify or custom?",
          "a": "Both routes are possible. We recommend a platform when it fits, and custom builds when you need something it can't do."
      },
      {
          "q": "Can you build a marketplace?",
          "a": "Yes, including seller onboarding, split payments, commissions and reviews."
      },
      {
          "q": "Can you connect to our stock system?",
          "a": "Yes. We integrate with inventory, ERP and point-of-sale systems through their APIs."
      },
      {
          "q": "Can you help us grow after launch?",
          "a": "Yes. Our performance marketing team runs campaigns and tests to improve conversion."
      }
  ],
  "industries-pre-seed-seed-startups": [
      {
          "q": "How much does a startup MVP cost?",
          "a": "A Validation MVP starts from £2,500, a Lean MVP from £5,000 and a Custom or SaaS platform from £10,000, with your price agreed before any work starts. Try our cost calculator for an instant estimate."
      },
      {
          "q": "How fast can we launch?",
          "a": "A Lean MVP usually takes 2–4 weeks, and a Validation MVP to test demand first takes 1–2 weeks."
      },
      {
          "q": "Can you help with our pitch?",
          "a": "We can build prototypes and product demos that make your pitch concrete."
      },
      {
          "q": "What if we pivot?",
          "a": "That's what validation is for. We keep builds lean so changing direction is affordable."
      }
  ],
  "industries-saas-startups": [
      {
          "q": "Can you build our SaaS from scratch?",
          "a": "Yes, from validation and design to billing, dashboards and launch."
      },
      {
          "q": "Do you handle subscriptions?",
          "a": "Yes. We set up plans, trials, upgrades and invoicing, usually with Stripe."
      },
      {
          "q": "Can you take over our existing product?",
          "a": "Yes. We start with a code review, then improve or rebuild what's needed."
      },
      {
          "q": "How do you keep customer data separate?",
          "a": "With a multi-tenant architecture and role-based access built in from the start."
      }
  ],
  "industries-logistics-transportation": [
      {
          "q": "Can you connect to our existing TMS or WMS?",
          "a": "Yes. We integrate through APIs or data feeds, or replace legacy tools step by step."
      },
      {
          "q": "Do driver apps work without signal?",
          "a": "Yes. We build offline-first apps that sync when a connection returns."
      },
      {
          "q": "Can you add live tracking for customers?",
          "a": "Yes, with tracking links, delivery windows and notifications by SMS or email."
      },
      {
          "q": "Where should we start?",
          "a": "Usually with the biggest bottleneck, such as dispatch or tracking, as a focused first release."
      }
  ],
  "industries-education-consulting": [
      {
          "q": "Should we use an off-the-shelf LMS?",
          "a": "Sometimes that's the right call. We build custom when you need your own brand, flows or business model."
      },
      {
          "q": "Can we sell courses and sessions online?",
          "a": "Yes, with one-off payments, subscriptions and bundles."
      },
      {
          "q": "Can you build a client portal for our consultancy?",
          "a": "Yes, with secure document sharing, updates and messaging."
      },
      {
          "q": "Can we launch quickly?",
          "a": "Yes. A low-code first version can go live fast, then grow into custom code."
      }
  ],
  "industries-recruitment-staffing": [
      {
          "q": "Can you integrate with our ATS or CRM?",
          "a": "Yes. We connect through their APIs, or automate between tools where APIs are limited."
      },
      {
          "q": "Can you build a job board?",
          "a": "Yes, with search, alerts, applications and multi-posting to other boards."
      },
      {
          "q": "Do you use AI for matching?",
          "a": "Where it helps. AI can rank and summarise candidates, with consultants making the final call."
      },
      {
          "q": "How do you handle candidate data?",
          "a": "With GDPR in mind: clear consent, retention rules and easy data requests."
      }
  ],
  "industries-industry-manufacturing": [
      {
          "q": "Can you connect to our ERP or machines?",
          "a": "Yes. We integrate with ERP and MES systems and can collect machine data through sensors or gateways."
      },
      {
          "q": "Will the apps work on the shop floor?",
          "a": "Yes. We design for tablets, gloves and noisy environments, with offline support where needed."
      },
      {
          "q": "Can we start small?",
          "a": "Yes. We usually digitise one process first, such as maintenance, then expand."
      },
      {
          "q": "Do you replace legacy systems?",
          "a": "Where it makes sense. Often we connect to them first and replace them gradually."
      }
  ],
  "brand-strategy": [
      {
          "q": "How much does branding cost?",
          "a": "Essential starts from £750, Identity from £1,500 and Complete from £2,500. Your price is agreed before any work starts, and you get editable files."
      },
      {
          "q": "Do you design logos only?",
          "a": "We can, but the best results come from positioning first, then the identity that expresses it."
      },
      {
          "q": "What do I receive?",
          "a": "Logo files, colour and type system, brand guidelines and any launch assets we agree."
      },
      {
          "q": "Can you refresh an existing brand?",
          "a": "Yes. We'll keep what works and evolve the rest."
      },
      {
          "q": "How long does a brand project take?",
          "a": "It depends on scope. A focused identity is quicker than a full strategy; we'll give you a clear timeline before we start."
      },
      {
          "q": "Will I get editable files?",
          "a": "Yes: vector logo files, colour codes, font details and editable templates."
      },
      {
          "q": "Can you apply the brand to our website?",
          "a": "Yes. We can carry your new brand straight into your website or product."
      }
  ],
  "partners": [
      {
          "q": "Who can join?",
          "a": "Anyone who meets businesses that need software, apps, AI, design or marketing: agencies without a development team, freelancers, business advisers, accountants, startup communities and past clients. We approve each partner. Vebryx staff can't take part."
      },
      {
          "q": "What do I earn?",
          "a": "10% of our fees up to £20,000, and 5% of anything above that, up to £5,000 a referral. For monthly services, the same on the first 6 months' fees. A ZERO.ONE earns a flat £50. Pro partners, with 3 or more paid referrals in 12 months, earn 12.5% on the first £20,000. Further work from the same client within 12 months of their first payment earns 5%."
      },
      {
          "q": "How do I register a referral?",
          "a": "Use the \"Refer a client\" form on this page, or email sales@vebryx.co.uk with you and the client both copied, before their first call with us. Only refer people who have agreed to us contacting them. We confirm in writing whether the referral is registered, and the commission it qualifies for."
      },
      {
          "q": "When does a referral count?",
          "a": "When the client is new to us (not in touch with us in the previous 6 months), signs within 6 months of your referral, and pays. If two partners introduce the same client, the first registered referral counts."
      },
      {
          "q": "What counts as fees?",
          "a": "What the client pays us, excluding VAT and third-party costs such as ad spend, hosting, software licences and app store fees. An audit fee that's credited against a build is counted once."
      },
      {
          "q": "When and how am I paid?",
          "a": "By bank transfer in pounds, within 14 days of each client payment clearing. When a project is paid in stages, commission is paid in stages too. Businesses send us an invoice, and you're responsible for your own tax."
      },
      {
          "q": "What if a client cancels or gets a refund?",
          "a": "Commission is due only on what the client pays and keeps paying. If we refund a payment, the commission on it comes off your next payout."
      },
      {
          "q": "What should I tell the people I refer?",
          "a": "That you may earn a referral fee. Please don't promise prices, timelines or results on our behalf: we'll quote after a call."
      },
      {
          "q": "Can the terms change?",
          "a": "We may change the rates for future referrals, with notice. A referral we've registered keeps the commission we confirmed. The full terms come with your welcome email."
      }
  ],
};
