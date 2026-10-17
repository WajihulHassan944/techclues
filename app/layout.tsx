import type { Metadata } from "next";
import "./site.css";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import HeaderScroll from "@/components/HeaderScroll";
import SmoothScroll from "@/components/SmoothScroll";
import SiteEffects from "@/components/SiteEffects";
import MobileMenu from "@/components/MobileMenu";
import FloatingUi from "@/components/FloatingUi";
import SiteChrome from "@/components/site/SiteChrome";
import ClientNav from "@/components/ClientNav";

export const metadata: Metadata = {
  title: "Birmingham Custom Software Development Company | TechClues",
  description:
    "An MVP development studio that helps founders validate, build and launch their digital products.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="poppins_287b9d5-module__CtRvUW__variable antialiased">
      <body>
        <SiteChrome
          top={
            <>
              <HeaderScroll />
              <SmoothScroll />
              <SiteEffects />
              <MobileMenu />
              <FloatingUi />
              <ClientNav />
              <SiteHeader />
            </>
          }
          bottom={<SiteFooter />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
