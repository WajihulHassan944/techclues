export type CaseStudyStatus = "draft" | "published";

export type CaseStudyResult = { value: string; label: string };
export type CaseStudyTestimonial = { quote: string; author: string; role: string };

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  services: string[];
  excerpt: string;
  /** Case study narrative as HTML from the visual editor, same as blog posts. */
  body: string;
  cover: string;
  coverAlt: string;
  images: string[];
  results: CaseStudyResult[];
  testimonial: CaseStudyTestimonial;
  status: CaseStudyStatus;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
};

/** Matches the site's existing /industries/* and /services/* slugs, offered as quick picks —
 *  the fields themselves are free text, so a case study can use a different value if needed. */
export { INDUSTRY_OPTIONS, SERVICE_OPTIONS } from "@/lib/case-study-meta";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
