import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { navLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-sm text-sm text-white/70">A product studio for founders who want to test, build and grow.</p>
          <p className="text-sm text-white/70">hello@techclues.example<br />Glasgow, United Kingdom</p>
          <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">Shopify Partner</span>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold">Explore</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {navLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
            ))}
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Get a free MVP roadmap.</h3>
          <ol className="space-y-1 text-sm text-white/70">
            <li>01 We review your idea</li>
            <li>02 We define your MVP strategy</li>
            <li>03 We deliver your roadmap</li>
          </ol>
          <Button href="/book-a-call" variant="light">Book your free strategy call</Button>
          <p className="text-xs text-white/50">30 minutes · no obligation</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-white/50 sm:px-8">
          <span>© {new Date().getFullYear()} Techclues. All rights reserved.</span>
          <span className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white">Privacy policy</Link>
            <Link href="/terms-conditions" className="hover:text-white">Terms &amp; conditions</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
