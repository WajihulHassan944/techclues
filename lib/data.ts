export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "How we work", href: "/how-we-work" },
  { label: "Case studies", href: "/case-studies" },
  { label: "MVP cost calculator", href: "/mvp-cost-calculator" },
  { label: "Company", href: "/about" },
];

export const projects = [
  "Northwind Fitness", "Harbour Foods", "Cardly", "Clinic Flow", "CareBridge",
  "MarketLoop", "TutorSpark", "Huebox", "Atlas Trading", "Vertex", "MindStride",
  "NutriPeak", "Urban Supply Co", "Glow Studio", "Scentwell", "Origo",
];

export const stats = [
  { value: "2–4", label: "weeks", note: "From idea to tested MVP" },
  { value: "4.3/5", label: "", note: "Average client rating" },
  { value: "60+", label: "", note: "Products launched" },
  { value: "1,000+", label: "", note: "Early sign-ups pre-build" },
  { value: "8", label: "", note: "Sectors covered" },
];

export const services = [
  { title: "MVPs & Custom Platforms", text: "A lean first version in front of real users, then room to grow.", href: "/services/mvp-development" },
  { title: "Prototype to Production", text: "Started with an AI builder? We harden it for real-world traffic.", href: "/services/prototype-to-production" },
  { title: "AI Integration & Automation", text: "Add AI features to existing products, or build AI-first from scratch.", href: "/services/ai-enablement" },
  { title: "Web & Mobile Apps", text: "Responsive web and mobile apps with a focus on speed and polish.", href: "/services/web-mobile-apps" },
  { title: "Low-Code / No-Code", text: "Ship a working product within days when time is tight.", href: "/services/low-code-no-code" },
  { title: "E-commerce & Marketplaces", text: "Storefronts and multi-seller marketplaces ready to take orders.", href: "/services/ecommerce-marketplace-development" },
];

export const aiCapabilities = [
  "Assistants & chatbots", "AI agents", "Knowledge search", "Document processing", "Workflow automation",
  "Content generation", "Voice & speech", "Vision & images", "Recommendations", "Custom & fine-tuned models",
];

export const aiSteps = [
  { title: "Message", text: "Via web chat, messaging apps or email" },
  { title: "Understand", text: "The model works out what is being asked" },
  { title: "Respond", text: "A reply in your tone, within seconds" },
  { title: "Hand over", text: "Passed to a person in their usual tool" },
];

export const aiProcess = [
  { title: "Map", text: "Review your systems and spot where automation pays off." },
  { title: "Connect", text: "Secure API links with least-privilege access." },
  { title: "Embed", text: "Features live inside current tools, with no migration." },
  { title: "Monitor", text: "Track quality, spend and usage, with human review where needed." },
];

export const stack: Record<string, string[]> = {
  Design: ["Figma", "Framer", "Illustrator", "Photoshop", "Miro", "Maze", "Lottie", "Storybook"],
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Flutter", "Three.js", "GSAP", "WebGL"],
  Backend: ["Node.js", "Express.js", "Python", ".NET", "PHP", "Redis"],
  Data: ["PostgreSQL", "MongoDB", "Supabase", "Neon", "Firebase", "Airtable"],
  AI: ["Claude", "OpenAI", "Gemini", "LangChain", "Hugging Face", "PyTorch"],
  "Cloud & integrations": ["AWS", "Google Cloud", "Azure", "Vercel", "DigitalOcean", "Stripe", "Shopify"],
};

export const caseStudies = [
  { tag: "Retail & e-commerce", name: "MarketLoop", title: "A two-sided online marketplace", text: "Sellers, buyers and automated promotion in one place.", href: "/case-studies/qiosk-marketplace", from: "#0064ff", to: "#4d8dff" },
  { tag: "Healthcare", name: "Clinic Flow", title: "Scheduling and records for clinics", text: "Bookings, patient notes and invoices in a single tool.", href: "/case-studies/dentora", from: "#1faa59", to: "#d7f5e1" },
  { tag: "Sports & fitness", name: "Northwind Fitness", title: "A community platform for team races", text: "Demand proven through a waitlist before development.", href: "/case-studies/infinite-running-league", from: "#e5484d", to: "#ffe6d6" },
  { tag: "Design tools", name: "Huebox", title: "A colour tool for designers", text: "A focused SaaS product taken from concept to release.", href: "/case-studies/palette-os", from: "#7c3aed", to: "#dbe7ff" },
];

export const phases = [
  { name: "Ignition", text: "Clarify the idea, the problem and what success looks like." },
  { name: "Compass", text: "Research and positioning, checked with real users." },
  { name: "Pillar", text: "Scope, architecture and a delivery roadmap." },
  { name: "Canvas", text: "Interface design and an interactive prototype." },
  { name: "Forge", text: "Front-end and back-end build, delivered in sprints." },
  { name: "Bridge", text: "Payments, email, maps and other third-party services." },
  { name: "Sentinel", text: "Testing across devices and browsers." },
  { name: "Everest", text: "Go-live, monitoring and early iterations." },
];

export const reasons = [
  { title: "Validation first", text: "Demand is tested up front so features earn their place." },
  { title: "Clear scope, fair price", text: "Open pricing and steady progress reports." },
  { title: "Built to scale", text: "Reliable tooling that scales as you do." },
];

export const industries = [
  { label: "Healthcare & medical", href: "/industries/healthcare-medical" },
  { label: "Logistics & transportation", href: "/industries/logistics-transportation" },
  { label: "Retail & e-commerce", href: "/industries/retail-ecommerce" },
  { label: "Education & consulting", href: "/industries/education-consulting" },
  { label: "Pre-seed & seed startups", href: "/industries/pre-seed-seed-startups" },
  { label: "Recruitment & staffing", href: "/industries/recruitment-staffing" },
  { label: "SaaS startups", href: "/industries/saas-startups" },
  { label: "Industry & manufacturing", href: "/industries/industry-manufacturing" },
];

export const faqs = [
  { q: "What does Techclues do?", a: "We help founders test ideas with real users, then design, build and grow the product." },
  { q: "What will an MVP cost me?", a: "Pricing depends on scope. Try the calculator for a quick estimate or book a call for a fixed quote." },
  { q: "How quickly can an MVP be ready?", a: "Most projects reach launch within a few weeks of agreeing the scope." },
  { q: "What is your build process?", a: "A phased, validation-led workflow with milestones and user feedback throughout." },
  { q: "Can an MVP grow into a full product?", a: "Yes. Many clients continue with us to add features and scale." },
  { q: "Do you help after launch?", a: "We offer flexible support plans covering monitoring, fixes and improvements." },
];

export const posts = [
  { tag: "Costs", title: "A realistic look at MVP pricing in the UK", href: "/blog/mvp-cost-uk" },
  { tag: "AI", title: "Bringing AI into a small business", href: "/blog/ai-integration-uk-smes" },
];
