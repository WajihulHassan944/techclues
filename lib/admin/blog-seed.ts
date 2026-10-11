import { BODIES } from "./blog-bodies";
import type { Author, BlogState, Category, Post } from "./blog-types";

export const SEED_IDS = ["post-1001", "post-1002", "post-1003", "post-1004", "post-1005", "post-1006"];

export function seedBlog(now: number): BlogState {
  const iso = (s: string) => new Date(s).toISOString();
  const in3d = new Date(now + 3 * 86_400_000);
  in3d.setHours(9, 0, 0, 0);
  const base = (p: Partial<Post> & Pick<Post, "id" | "slug" | "title" | "excerpt" | "category" | "body" | "status" | "seoTitle" | "seoDescription">): Post => ({
    authorId: "au-1", cover: "", coverAlt: "", createdAt: iso("2026-08-20T10:00:00Z"), updatedAt: iso("2026-08-20T10:00:00Z"), ...p,
  });

  const posts: Post[] = [
    base({
      id: "post-1001", slug: "mvp-software-development-age-of-ai", title: "MVP Software Development in the Age of AI", category: "AI", status: "published",
      excerpt: "MVP software development helps startups test ideas with real users, cut costs, and use AI tools to move fast without overbuilding.",
      cover: "/images/media/mvp-software-development-vebryx-7df8a242be.webp", coverAlt: "MVP Software Development",
      body: BODIES["mvp-software-development-age-of-ai"], publishedAt: iso("2026-10-06T09:00:00Z"), updatedAt: iso("2026-10-06T09:00:00Z"),
      seoTitle: "MVP Software Development in the Age of AI | TechClues",
      seoDescription: "Most startups fail because they build too much, too early. MVP software development is how you validate before you commit, and AI tools have made it faster than ever.",
    }),
    base({
      id: "post-1002", slug: "ai-funding-uk-scotland", title: "Funding for AI projects in the UK and Scotland", category: "Funding", status: "published",
      excerpt: "What's actually open to UK and Scottish businesses that want to use AI, including Scotland's AI adoption programme, what's paused, and how to plan a project that doesn't depend on a grant.",
      cover: "/images/blog/ai-funding.jpg", coverAlt: "Victorian and modern buildings side by side in Glasgow",
      body: BODIES["ai-funding-uk-scotland"], publishedAt: iso("2026-09-25T09:00:00Z"), updatedAt: iso("2026-09-25T09:00:00Z"),
      seoTitle: "AI Funding for UK & Scottish Businesses (2026) | TechClues",
      seoDescription: "What's actually open to UK and Scottish businesses that want to use AI, including Scotland's AI adoption programme, what's paused, and how to plan a project that doesn't depend on a grant.",
    }),
    base({
      id: "post-1003", slug: "mvp-cost-uk", title: "How much does an MVP cost in the UK?", category: "Costs", status: "published",
      excerpt: "What an MVP budget pays for, the four choices that move the price most, and the costs founders forget. With real figures from our own pricing.",
      cover: "/images/services/mvp.jpg", coverAlt: "A team planning a product together at a whiteboard",
      body: BODIES["mvp-cost-uk"], publishedAt: iso("2026-08-26T09:00:00Z"), updatedAt: iso("2026-09-30T09:00:00Z"),
      seoTitle: "MVP Cost in UK and How Much Startups Should Budget | TechClues",
      seoDescription: "Find out the MVP cost in UK and what drives the price. Learn the hidden costs founders miss and how to spend less. Get an instant estimate.",
    }),
    base({
      id: "post-1004", slug: "prototype-vs-mvp", title: "Prototype vs MVP: which one do you need?", category: "Strategy", status: "draft",
      excerpt: "A prototype answers “can we build it?” and an MVP answers “will anyone use it?”. Here's how to choose the right first step.",
      body: "<p>People use “prototype” and “MVP” as if they mean the same thing. They don't, and mixing them up is one of the quickest ways to spend money on the wrong thing.</p><h2>What a prototype is for</h2><p>A prototype shows how something will look and feel. It is quick and cheap, and it is for learning before you build.</p><h2>What an MVP is for</h2><p>An MVP is a working product, small enough to build fast, that real people can use. It is for learning whether the idea works in the world.</p><h2>How to choose</h2><ul><li>If you are unsure what to build, start with a prototype.</li><li>If you know what to build and need proof of demand, build an MVP.</li></ul>",
      seoTitle: "Prototype vs MVP: Which One Do You Need? | TechClues", seoDescription: "", updatedAt: new Date(now - 2 * 86_400_000).toISOString(),
    }),
    base({
      id: "post-1005", slug: "validate-startup-idea-before-development", title: "How to validate a startup idea before you write any code", category: "Validation", status: "scheduled", scheduledFor: in3d.toISOString(),
      excerpt: "Five cheap ways to find out whether people want your idea, before you spend anything on development.",
      cover: "/images/services/mvp.jpg", coverAlt: "Founders reviewing customer interviews",
      body: "<p>The cheapest time to find out an idea won't work is before you build it. These are the tests we use with founders.</p><h2>1. Talk to ten people</h2><p>Not friends and family. People who have the problem you want to solve.</p><h2>2. Put up a waitlist</h2><p>A simple page explaining the idea and asking for an email address shows how many people care enough to sign up.</p><h2>3. Pre-sell</h2><p>Nothing proves demand like a payment. Even a small deposit tells you more than a hundred compliments.</p>",
      seoTitle: "How to Validate a Startup Idea Before Development | TechClues", seoDescription: "Five cheap ways to test whether people want your startup idea before you spend anything on development.", updatedAt: new Date(now - 86_400_000).toISOString(),
    }),
    base({
      id: "post-1006", slug: "no-code-vs-custom-development", title: "No-code or custom code for your MVP?", category: "Building", status: "draft", authorId: "au-2",
      excerpt: "When no-code platforms like Bubble and Webflow are the smart choice for a startup, when custom code is worth it, and how to move from one to the other.",
      body: "<p>Draft in progress.</p>", seoTitle: "", seoDescription: "", updatedAt: new Date(now - 5 * 86_400_000).toISOString(),
    }),
  ];

  const categories: Category[] = ["AI", "Funding", "Costs", "Building", "Validation", "Strategy"].map((name, i) => ({ id: `cat-${i + 1}`, name }));
  const authors: Author[] = [
    { id: "au-1", name: "TechClues team", role: "Editorial" },
    { id: "au-2", name: "Khashir Khalil", role: "Founder and CEO" },
  ];
  return { posts, categories, authors };
}
