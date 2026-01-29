import { ChevronDownIcon, ReaderIcon } from "@radix-ui/react-icons";
import { IconShieldCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LandingNav() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-gray-light font-sans transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center shadow-lg shadow-brand-dark/20 group-hover:scale-105 transition-transform duration-300">
                        <IconShieldCheck className="h-5 w-5 text-brand-light" />
                    </div>
                    <span className="font-heading font-black text-xl tracking-tight text-brand-dark">
                        ShipDocket
                    </span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/services"
                        className="text-sm font-medium text-brand-gray-mid hover:text-brand-dark transition-colors"
                    >
                        Services
                    </Link>
                    <Link
                        to="/pricing"
                        className="text-sm font-medium text-brand-gray-mid hover:text-brand-dark transition-colors"
                    >
                        Pricing
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-brand-gray-mid hover:text-brand-dark transition-colors outline-none data-[state=open]:text-brand-dark">
                            Company{" "}
                            <ChevronDownIcon className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-white/95 backdrop-blur-xl border-brand-gray-light shadow-xl rounded-xl p-2 min-w-[180px]"
                        >
                            <DropdownMenuItem
                                asChild
                                className="rounded-lg focus:bg-brand-light focus:text-brand-dark cursor-pointer text-brand-gray-mid"
                            >
                                <Link to="/about">About Us</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                                className="rounded-lg focus:bg-brand-light focus:text-brand-dark cursor-pointer text-brand-gray-mid"
                            >
                                <Link to="/why-shipdocket">Why ShipDocket</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                                className="rounded-lg focus:bg-brand-light focus:text-brand-dark cursor-pointer text-brand-gray-mid"
                            >
                                <Link to="/careers">Careers</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-brand-gray-mid hover:text-brand-dark transition-colors outline-none data-[state=open]:text-brand-dark">
                            Resources{" "}
                            <ChevronDownIcon className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-white/95 backdrop-blur-xl border-brand-gray-light shadow-xl rounded-xl p-2 min-w-[180px]"
                        >
                            <DropdownMenuItem
                                asChild
                                className="rounded-lg focus:bg-brand-light focus:text-brand-dark cursor-pointer text-brand-gray-mid"
                            >
                                <Link to="/blog">Blog</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                                className="rounded-lg focus:bg-brand-light focus:text-brand-dark cursor-pointer text-brand-gray-mid"
                            >
                                <Link to="/security-faq">Security FAQ</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-brand-dark font-medium hover:bg-brand-light hover:text-brand-dark rounded-lg"
                    >
                        <Link to="/login">Sign In</Link>
                    </Button>
                    <Button
                        size="sm"
                        asChild
                        className="rounded-lg bg-brand-dark text-brand-light hover:bg-black font-semibold shadow-lg shadow-brand-dark/10 hover:shadow-xl hover:shadow-brand-dark/20 transition-all duration-300"
                    >
                        <Link to="/onboarding">Start Shipping</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
