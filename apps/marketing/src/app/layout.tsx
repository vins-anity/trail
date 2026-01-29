import type { Metadata } from "next";
import { Lora, Poppins } from "next/font/google"; // Import Brand Fonts
import { LandingFooter } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/header";
import "./globals.css";

// Configure Fonts
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

const lora = Lora({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-lora",
});

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
            <body
                className={`${poppins.variable} ${lora.variable} antialiased font-sans flex flex-col min-h-screen bg-background text-foreground`}
            >
                <LandingNav />
                <main className="flex-1">{children}</main>
                <LandingFooter />
            </body>
        </html>
    );
}
