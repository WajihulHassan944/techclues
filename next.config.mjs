/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only used for local/e2e testing: proxies /api/* through this same-origin Next.js server to
  // a backend running elsewhere (e.g. http://localhost:4000), so the browser sees same-origin
  // requests and the admin session cookie isn't subject to cross-site SameSite restrictions.
  // In production the frontend and API are genuinely different origins and talk directly
  // (see NEXT_PUBLIC_API_URL + the API's CORS/cookie config) — this rewrite is a no-op there.
  async rewrites() {
    const target = process.env.API_PROXY_TARGET;
    if (!target) return [];
    return [{ source: "/api/:path*", destination: `${target}/api/:path*` }];
  },
};
export default nextConfig;
