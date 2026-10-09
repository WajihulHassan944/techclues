import type { Metadata } from "next";
import "./site.css";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import HeaderScroll from "@/components/HeaderScroll";
import SmoothScroll from "@/components/SmoothScroll";
import SiteEffects from "@/components/SiteEffects";
import MobileMenu from "@/components/MobileMenu";
import FloatingUi from "@/components/FloatingUi";
import ClientNav from "@/components/ClientNav";

export const metadata: Metadata = {
  title: "Custom Software Development Company in Glasgow | Vebryx",
  description:
    "MVP development studio helping founders validate, build and launch digital products.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="poppins_287b9d5-module__CtRvUW__variable antialiased">
      <body>
        <HeaderScroll />
        <SmoothScroll />
        <SiteEffects />
        <MobileMenu />
        <FloatingUi />
        <ClientNav />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
