import type { Metadata } from "next";
import "./site.css";

export const metadata: Metadata = {
  title: "Custom Software Development Company in Glasgow | Vebryx",
  description:
    "MVP development studio helping founders validate, build and launch digital products.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="poppins_287b9d5-module__CtRvUW__variable antialiased">
      <body>{children}</body>
    </html>
  );
}
