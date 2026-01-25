import { ReaderIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LandingNav() {
    return (
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <ReaderIcon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-lg">ShipDocket</span>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/services"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
                    >
                        Services
                    </Link>
                    <Link
                        to="/pricing"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
                    >
                        Pricing
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition outline-none">
                            Company <ChevronDownIcon className="w-3 h-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link to="/about">About Us</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/why-shipdocket">Why ShipDocket</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/careers">Careers</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition outline-none">
                            Resources <ChevronDownIcon className="w-3 h-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link to="/blog">Blog</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/security-faq">Security FAQ</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/auth/login">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link to="/onboarding">Start Shipping</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
