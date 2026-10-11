import type { Enquiry, InboxState } from "./inbox-types";

const min = (now: number, m: number) => new Date(now - m * 60_000).toISOString();

/** Sample enquiries, one or more per website form. Replaced by real submissions once the panel is connected. */
export function seedInbox(now: number): InboxState {
  const e = (x: Omit<Enquiry, "received" | "thread" | "notes" | "starred" | "folder" | "read" | "status"> & Partial<Pick<Enquiry, "thread" | "notes" | "starred" | "folder" | "read" | "status">> & { ago: number }): Enquiry => {
    const { ago, ...rest } = x;
    return { thread: [], notes: [], starred: false, folder: "inbox", read: false, status: "new", ...rest, received: min(now, ago) };
  };
  const m = (id: string, from: "them" | "us", ago: number, body: string) => ({ id, from, at: min(now, ago), body });

  const enquiries: Enquiry[] = [
    e({
      id: "enq-1001", source: "contact", name: "Sarah Whitfield", email: "sarah@brightpathtutoring.co.uk", company: "Brightpath Tutoring", ago: 12,
      subject: "Tutoring marketplace: MVP and web app",
      message: "Hi, we run a small tutoring agency in Manchester and want to turn it into a marketplace where parents can book vetted tutors online. We have a rough spec and about six months of runway. Could we talk through what an MVP would look like and what it might cost?",
      details: [{ label: "I need", value: "MVP, Web or mobile app" }, { label: "Budget", value: "£15k–£40k" }],
    }),
    e({
      id: "enq-1002", source: "calculator", name: "Daniel Okafor", email: "daniel@fleetwise.io", phone: "+44 7700 900412", company: "Fleetwise", ago: 47,
      subject: "Estimate: fleet maintenance web and mobile app",
      message: "Used the MVP cost calculator and asked for the estimate by email.",
      details: [{ label: "Goal", value: "Launch a new product" }, { label: "Platform", value: "Web and mobile" }, { label: "Pace", value: "Balanced" }, { label: "Features", value: "Sign-up and login, Dashboard, Notifications, Payments" }],
      result: { title: "Estimate shown to the visitor", headline: "£18,400 – £24,600", lines: ["Timeline: 10–12 weeks", "Based on 4 features, web and mobile"] },
    }),
    e({
      id: "enq-1003", source: "kill-my-idea", name: "Priya Nair", email: "priya.nair@gmail.com", ago: 130,
      subject: "Idea tested: pet-sitter marketplace",
      message: "A marketplace that matches busy professionals with trusted pet sitters nearby.",
      details: [{ label: "Who is it for?", value: "Busy professionals with dogs or cats in UK cities" }, { label: "What do they use today?", value: "Facebook groups, Rover, friends" }, { label: "How much does the problem hurt?", value: "Quite a lot" }, { label: "Why you, and not them?", value: "I run a 2,000-member local sitter group" }],
      result: { title: "Verdict shown to the visitor", headline: "Watch this", lines: ["Holds up: you already have an audience", "Weak point: Rover and Facebook groups are free and familiar"] },
    }),
    e({
      id: "enq-1004", source: "grant", name: "Marcus Doyle", email: "marcus@doylefabrication.co.uk", phone: "+44 7911 123456", company: "Doyle Fabrication Ltd", ago: 190,
      subject: "Grant support: production scheduling automation",
      message: "We want to replace spreadsheets with a production scheduling tool and would like to know whether any funding could support it.",
      details: [{ label: "Type of business", value: "Limited company" }, { label: "Based in", value: "England" }, { label: "Company size", value: "11–50 employees" }, { label: "Annual turnover", value: "£1m–£5m" }, { label: "Project", value: "Automation" }, { label: "Estimated budget", value: "£20k–£50k" }, { label: "Match funding", value: "Yes, some of it" }, { label: "When to start", value: "As soon as possible" }],
    }),
    e({
      id: "enq-1005", source: "zero-one", name: "Hannah Lee", email: "hannah@fitloop.app", phone: "+44 7488 220915", company: "FitLoop", ago: 1500, read: true,
      subject: "ZERO.ONE brief: last-minute gym classes",
      message: "An app that fills last-minute gym class cancellations by offering the spots to nearby members at a discount.",
      details: [{ label: "Idea", value: "An app that fills last-minute gym class cancellations" }, { label: "Testers lined up", value: "Five members from my own gym" }],
    }),
    e({
      id: "enq-1006", source: "partner-refer", name: "Tom Gallagher", email: "tom@pixelandpine.studio", company: "Pixel & Pine", ago: 1620, starred: true,
      subject: "Referral: Carvers Bakery online ordering",
      message: "Introducing a client who needs online ordering and click-and-collect for a three-shop bakery.",
      details: [{ label: "Referring as", value: "Design or marketing agency" }, { label: "Client", value: "Carvers Bakery" }, { label: "Client contact", value: "Ellie Carver, ellie@carversbakery.co.uk" }, { label: "Type of project", value: "E-commerce & Marketplaces" }, { label: "Rough budget", value: "£6k–£15k" }, { label: "Client agreed to contact", value: "Yes" }],
    }),
    e({
      id: "enq-1007", source: "partner-join", name: "Aisha Rahman", email: "aisha@rahmanandco.co.uk", company: "Rahman & Co Accountants", ago: 2900, read: true, status: "replied",
      subject: "Partner application: accountancy practice",
      message: "We advise around 120 small businesses and regularly get asked who to trust for software. Interested in becoming a referral partner.",
      details: [{ label: "I am a", value: "Business adviser or accountant" }, { label: "Clients are", value: "Mostly UK" }, { label: "Introductions", value: "MVPs & Custom Platforms, Web & Mobile Apps" }, { label: "Website", value: "rahmanandco.co.uk" }],
      thread: [m("t-1", "us", 2700, "Hi Aisha,\n\nThanks for applying, we'd be glad to have you as a partner. I'll send over the partner pack and the referral terms today. Would a 20-minute call this week suit you to go through how it works?\n\nBest wishes,\nTechClues team")],
    }),
    e({
      id: "enq-1008", source: "careers", name: "Luca Moretti", email: "luca.moretti@proton.me", ago: 3000, read: true,
      subject: "Application: Full-stack development",
      message: "Full-stack developer with six years of experience in TypeScript, Next.js and Node. Happy to work with teams in the UK and Pakistan time zones.",
      details: [{ label: "Role", value: "Full-stack development" }, { label: "Based in", value: "Leeds, UK" }, { label: "Portfolio", value: "github.com/lmoretti" }],
      attachments: [{ name: "Luca-Moretti-CV.pdf", size: "212 KB" }],
    }),
    e({
      id: "enq-1009", source: "contact", name: "James Carter", email: "james@northernfreight.co.uk", phone: "+44 7766 301288", company: "Northern Freight", ago: 4400, read: true, status: "qualified", starred: true,
      subject: "Shipment tracking platform for hauliers",
      message: "We are a mid-sized haulier and want a customer-facing tracking portal that plugs into our existing dispatch system. Budget is agreed internally; we need a partner who has done this before.",
      details: [{ label: "I need", value: "MVP, Web or mobile app" }, { label: "Budget", value: "£40k+" }],
      thread: [
        m("t-1", "us", 4300, "Hi James,\n\nThanks for getting in touch. Tracking portals tied to dispatch systems are something we've built before. Could you send over a little detail on the dispatch software you use, and book a 30-minute call so we can scope it properly?\n\nBest wishes,\nTechClues team"),
        m("t-2", "them", 3900, "Thanks. We use Mandata. I've booked Thursday at 11:00."),
        m("t-3", "us", 3800, "Perfect, speak Thursday."),
      ],
      notes: [{ id: "n-1", at: min(now, 3700), body: "Good fit. Decision maker is James. Send a ballpark after the call." }],
    }),
    e({
      id: "enq-1010", source: "calculator", name: "Emily Zhang", email: "emily@lumenhealth.co", ago: 5700, read: true, status: "replied",
      subject: "Estimate: patient intake web app",
      message: "Used the MVP cost calculator and asked for the estimate by email.",
      details: [{ label: "Goal", value: "Replace an existing system" }, { label: "Platform", value: "Web" }, { label: "Pace", value: "Fast" }, { label: "Features", value: "Sign-up and login, Forms, Admin panel" }],
      result: { title: "Estimate shown to the visitor", headline: "£12,100 – £16,800", lines: ["Timeline: 6–8 weeks", "Based on 3 features, web"] },
      thread: [m("t-1", "us", 5600, "Hi Emily,\n\nThanks for using the calculator. The range you saw is a good starting point. If you'd like, we can book a free 30-minute call to check it against your actual workflow.\n\nBest wishes,\nTechClues team")],
    }),
    e({
      id: "enq-1011", source: "grant", name: "Olivia Brennan", email: "olivia@greenpathcic.org", company: "Greenpath CIC", ago: 7100, read: true,
      subject: "Grant support: community volunteer platform",
      message: "We are a community interest company running neighbourhood clean-ups and want a volunteer sign-up platform.",
      details: [{ label: "Type of business", value: "Charity or CIC" }, { label: "Based in", value: "Scotland" }, { label: "Company size", value: "2–10 employees" }, { label: "Project", value: "Software platform" }, { label: "Estimated budget", value: "Under £20k" }, { label: "When to start", value: "Within 3 months" }],
    }),
    e({
      id: "enq-1012", source: "contact", name: "Ben Taylor", email: "ben@oddsocksclub.com", company: "Odd Socks Club", ago: 12900, read: true, status: "won",
      subject: "Subscription box site and app",
      message: "We sell a monthly sock subscription and want a proper site with customer accounts and a simple mobile app.",
      details: [{ label: "I need", value: "Web or mobile app, Branding" }, { label: "Budget", value: "£6k–£15k" }],
      thread: [
        m("t-1", "us", 12800, "Hi Ben,\n\nGreat idea. Let's book a call to go through the details."),
        m("t-2", "them", 12000, "Booked, thanks."),
        m("t-3", "us", 9000, "Great speaking to you. Proposal attached: £9,800, 7 weeks."),
        m("t-4", "them", 8600, "Approved. Send over the contract and we'll get started."),
      ],
      notes: [{ id: "n-2", at: min(now, 8500), body: "Won. Deposit invoice sent." }],
    }),
    e({
      id: "enq-1013", source: "zero-one", name: "Rahul Mehta", email: "rahul@spliteasy.in", ago: 8700, read: true, status: "lost",
      subject: "ZERO.ONE brief: bill splitting app",
      message: "An app to split shared household bills automatically.",
      details: [{ label: "Idea", value: "An app to split shared household bills automatically" }, { label: "Testers lined up", value: "Not yet" }],
      thread: [m("t-1", "us", 8600, "Hi Rahul,\n\nThanks for the brief. ZERO.ONE needs five people lined up to test, so it may be worth finding testers first. Come back to us when you have them."), m("t-2", "them", 8000, "Understood, I'll get back to you next month.")],
    }),
    e({
      id: "enq-1014", source: "kill-my-idea", name: "Chloe Evans", email: "chloe@evansstudio.co.uk", ago: 11500, read: true, status: "replied",
      subject: "Idea tested: online pottery classes",
      message: "Live-streamed pottery classes with a kit posted to your door.",
      details: [{ label: "Who is it for?", value: "Adults who want a creative hobby at home" }, { label: "What do they use today?", value: "YouTube, local evening classes" }, { label: "How much does the problem hurt?", value: "A little" }, { label: "Why you, and not them?", value: "I'm a ceramicist with 12k followers" }],
      result: { title: "Verdict shown to the visitor", headline: "Holds up", lines: ["Holds up: strong audience and a clear product", "Weak point: shipping fragile kits"] },
      thread: [m("t-1", "us", 11400, "Hi Chloe,\n\nNice result. Before building anything, try selling five kits to your followers. We can help you set that test up if useful.")],
    }),
    e({
      id: "enq-1015", source: "contact", name: "Mark Johnson", email: "mark@seo-rankboost.top", company: "RankBoost", ago: 600, folder: "spam",
      subject: "Page one on Google in 7 days (guaranteed)",
      message: "Hello, we can get your website to the first page of Google within a week for only £99. Reply YES for details. Limited slots!!!",
      details: [{ label: "I need", value: "Marketing" }, { label: "Budget", value: "Not sure yet" }],
    }),
    e({
      id: "enq-1016", source: "contact", name: "Crypto Alerts", email: "winner@freecoin-claim.xyz", ago: 3200, folder: "spam", read: true,
      subject: "You have been selected",
      message: "Claim your free bitcoin now. Click the link in the message to receive 0.5 BTC.",
      details: [{ label: "I need", value: "Other" }],
    }),
    e({
      id: "enq-1017", source: "careers", name: "Dev Patel", email: "dev.patel@example.com", ago: 20000, folder: "trash", read: true,
      subject: "Application: Mobile apps",
      message: "Sent in by mistake, please ignore.",
      details: [{ label: "Role", value: "Mobile apps" }, { label: "Based in", value: "London, UK" }],
    }),
  ];
  return { enquiries, blocked: [{ email: "promo@cheap-backlinks.biz", at: min(now, 40000) }] };
}
