import type { ReactNode } from "react";
import { LandingNav } from "../landing/header";
import { LandingFooter } from "../landing/footer";

interface LandingLayoutProps {
    children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
            <LandingNav />
            <main className="flex-1">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
}
