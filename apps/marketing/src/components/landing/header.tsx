"use client";

import { ChevronDownIcon, ReaderIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { env } from "@/env.mjs";

export function LandingNav() {
    return (
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <ReaderIcon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-lg">ShipDocket</span>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/services"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
                    >
                        Services
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
                    >
                        Pricing
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            suppressHydrationWarning
                            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition outline-none"
                        >
                            Company <ChevronDownIcon className="w-3 h-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/about">About Us</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/why-shipdocket">Why ShipDocket</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/careers">Careers</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            suppressHydrationWarning
                            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition outline-none"
                        >
                            Resources <ChevronDownIcon className="w-3 h-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/blog">Blog</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/security-faq">Security FAQ</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={`${env.NEXT_PUBLIC_APP_URL}/login`}>Sign In</a>
                    </Button>
                    <Button size="sm" asChild>
                        <a href={`${env.NEXT_PUBLIC_APP_URL}/onboarding`}>Start Shipping</a>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
