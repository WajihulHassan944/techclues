/** Every page/section FAQs can belong to, with a friendly label for the admin panel. */
export type FaqGroupDef = { key: string; label: string; section: string };

export const FAQ_GROUPS: FaqGroupDef[] = [
  { key: "home", label: "Homepage", section: "Pages" },
  { key: "calculator", label: "MVP cost calculator", section: "Pages" },
  { key: "partners", label: "Partners", section: "Pages" },
  { key: "grant-funding", label: "Grant funding", section: "Pages" },
  { key: "zero-one", label: "ZERO.ONE", section: "Pages" },
  { key: "faq-getting-started", label: "Getting started", section: "FAQ page" },
  { key: "faq-pricing", label: "Pricing & payments", section: "FAQ page" },
  { key: "faq-process", label: "Timelines & process", section: "FAQ page" },
  { key: "faq-mvp", label: "MVPs & validation", section: "FAQ page" },
  { key: "faq-design", label: "Design & brand", section: "FAQ page" },
  { key: "faq-technology", label: "Development & technology", section: "FAQ page" },
  { key: "faq-ai", label: "AI", section: "FAQ page" },
  { key: "faq-launch", label: "Launch, support & handover", section: "FAQ page" },
  { key: "faq-working-together", label: "Working together", section: "FAQ page" },
  { key: "faq-fit", label: "Industries & fit", section: "FAQ page" },
  { key: "mvp-development", label: "MVP development", section: "Services" },
  { key: "prototype-to-production", label: "Prototype to production", section: "Services" },
  { key: "low-code-no-code", label: "Low-code / no-code", section: "Services" },
  { key: "performance-marketing", label: "Performance marketing", section: "Services" },
  { key: "web-mobile-apps", label: "Web & mobile apps", section: "Services" },
  { key: "ecommerce-marketplace-development", label: "E-commerce & marketplace", section: "Services" },
  { key: "ui-ux-design", label: "UI/UX design", section: "Services" },
  { key: "brand-strategy", label: "Brand & strategy", section: "Services" },
  { key: "industries-healthcare-medical", label: "Healthcare & medical", section: "Industries" },
  { key: "industries-retail-ecommerce", label: "Retail & e-commerce", section: "Industries" },
  { key: "industries-pre-seed-seed-startups", label: "Pre-seed & seed startups", section: "Industries" },
  { key: "industries-saas-startups", label: "SaaS startups", section: "Industries" },
  { key: "industries-logistics-transportation", label: "Logistics & transportation", section: "Industries" },
  { key: "industries-education-consulting", label: "Education & consulting", section: "Industries" },
  { key: "industries-recruitment-staffing", label: "Recruitment & staffing", section: "Industries" },
  { key: "industries-industry-manufacturing", label: "Manufacturing", section: "Industries" },
];

export const FAQ_GROUP_SECTIONS = [...new Set(FAQ_GROUPS.map((g) => g.section))];

export function faqGroupLabel(key: string): string {
  return FAQ_GROUPS.find((g) => g.key === key)?.label ?? key;
}
