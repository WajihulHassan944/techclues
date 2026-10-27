const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getPageContent(page: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_URL}/api/public/page-content/${page}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("bad status");
    return await res.json();
  } catch {
    return {};
  }
}
