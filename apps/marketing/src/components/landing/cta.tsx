import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function LandingCta() {
    return (
        <section className="relative py-24 overflow-hidden border-t border-border bg-card/50">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
                <h2 className="text-5xl font-bold leading-tight">Ready to Ship?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Turn your next sprint into a signed contract. Eliminate the trust gap forever.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" className="rounded-full px-8">
                        Start Shipping (Free Beta) <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 bg-transparent"
                    >
                        Schedule a Walkthrough
                    </Button>
                </div>
                <div className="pt-8 space-y-2 text-sm text-muted-foreground">
                    <p>Questions? Email us at manifest@shipdocket.com</p>
                </div>
            </div>
        </section>
    );
}
