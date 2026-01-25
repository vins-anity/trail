import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function LandingCta() {
    return (
        <section className="relative py-24 overflow-hidden border-t border-border bg-card/50">
            <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
                <h2 className="text-5xl font-bold leading-tight">
                    Ready to Stop Proving Nothing?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join beta agencies proving every deliverable. Free trial—no card.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" className="rounded-full px-8">
                        Free Beta Trial (No CC){" "}
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 bg-transparent"
                    >
                        Schedule a Demo
                    </Button>
                </div>
                <div className="pt-8 space-y-2 text-sm text-muted-foreground">
                    <p>
                        Questions? Email us at hello@trail-ai.com or call +1 (555) 123-4567
                    </p>
                    <p>Available 9am–6pm EST, Monday–Friday</p>
                </div>
            </div>
        </section>
    );
}
