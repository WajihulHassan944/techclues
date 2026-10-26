/** Shared between the admin case study editor and the public case studies page — matches the
 *  site's existing /industries/* and /services/* slugs. */
export const INDUSTRY_OPTIONS = [
  { value: "healthcare-medical", label: "Healthcare & medical" },
  { value: "logistics-transportation", label: "Logistics & transportation" },
  { value: "retail-ecommerce", label: "Retail & e-commerce" },
  { value: "education-consulting", label: "Education & consulting" },
  { value: "pre-seed-seed-startups", label: "Pre-seed & seed startups" },
  { value: "recruitment-staffing", label: "Recruitment & staffing" },
  { value: "saas-startups", label: "SaaS startups" },
  { value: "industry-manufacturing", label: "Industry & manufacturing" },
];

export const SERVICE_OPTIONS = [
  { value: "mvp-development", label: "MVPs & Custom Platforms" },
  { value: "prototype-to-production", label: "Prototype to Production" },
  { value: "ai-enablement", label: "AI Integration & Automation" },
  { value: "web-mobile-apps", label: "Web & Mobile Apps" },
  { value: "ui-ux-design", label: "UI/UX & Prototyping" },
  { value: "low-code-no-code", label: "Low-Code / No-Code" },
  { value: "staff-augmentation", label: "Staff Augmentation" },
  { value: "game-development", label: "Game Development" },
  { value: "ecommerce-marketplace-development", label: "E-commerce & Marketplaces" },
  { value: "performance-marketing", label: "Performance Marketing" },
  { value: "brand-strategy", label: "Strategy & Brand Identity" },
];

export const industryLabel = (value: string) => INDUSTRY_OPTIONS.find((o) => o.value === value)?.label ?? value;
export const serviceLabel = (value: string) => SERVICE_OPTIONS.find((o) => o.value === value)?.label ?? value;
