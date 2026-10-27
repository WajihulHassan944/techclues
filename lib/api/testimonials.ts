export type PublicTestimonial = { id: string; quote: string; name: string; role: string; initials: string; photo?: string };

type ApiTestimonial = { _id: string; quote: string; name: string; role: string; initials?: string; photo?: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/testimonials`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("bad status");
    const rows: ApiTestimonial[] = await res.json();
    return rows.map((t) => ({
      id: t._id,
      quote: t.quote,
      name: t.name,
      role: t.role,
      initials: t.initials || t.name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join(""),
      photo: t.photo,
    }));
  } catch {
    return [];
  }
}
