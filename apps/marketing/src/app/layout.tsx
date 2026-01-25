import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShipDocket",
  description: "The Bill of Lading for Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <LandingNav />
        <main className="flex-1">
          {children}
        </main>
        <LandingFooter />
      </body>
    </html>
  );
}
