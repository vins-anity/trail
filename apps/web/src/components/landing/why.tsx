import { PersonIcon, LockClosedIcon } from "@radix-ui/react-icons";

export function LandingWhy() {
    return (
        <section className="relative py-24 overflow-hidden border-t border-border bg-card/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-5xl font-bold leading-tight">
                            Why We Built Trail AI
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            10+ years agency pain—disputes wasted weeks. We fixed it.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Trail AI is the result. Clarity Wins: Proof kills arguments pre-start.
                        </p>
                        <div className="space-y-4 pt-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <PersonIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Agency-Built
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Lived the chaos.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <LockClosedIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        Secure
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        SOC2 path, hash-immutable. No code ingested.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/20 rounded-2xl p-12 flex items-center justify-center min-h-96">
                        <div className="text-center space-y-4">
                            <LockClosedIcon className="w-24 h-24 text-primary mx-auto opacity-20" />
                            <p className="text-muted-foreground">
                                Join beta agencies proving every deliverable.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
