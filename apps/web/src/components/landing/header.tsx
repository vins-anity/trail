import { LockClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function LandingNav() {
    return (
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <LockClosedIcon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-lg">Trail AI</span>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="#features"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        How It Works
                    </a>
                    <a
                        href="#pricing"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        Pricing
                    </a>
                    <a
                        href="#faq"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        FAQ
                    </a>
                    <Button size="sm">Free Beta Trial</Button>
                </div>
            </div>
        </nav>
    );
}
