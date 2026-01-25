import {
    PersonIcon,
    CodeIcon,
    BarChartIcon,
    ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

export function LandingProblem() {
    return (
        <section className="bg-card border-t border-b border-border py-20">
            <div className="max-w-6xl mx-auto px-6 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold">The Execution Gap</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Without proof, delivery = finger-pointing. Clients question. Managers
                        chase visibility.
                    </p>
                </div>

                <div className="space-y-6 max-w-3xl mx-auto relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent leading-3" />

                    <div className="flex gap-6 pb-8">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                            <PersonIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="font-semibold text-lg">Task in Slack</h3>
                            <p className="text-muted-foreground text-sm">
                                Commits vanish—no formal record. Fleeting intent.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 pb-8">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-muted border-2 border-muted-foreground flex items-center justify-center">
                            <CodeIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="font-semibold text-lg">GitHub Work</h3>
                            <p className="text-muted-foreground text-sm">
                                Merges/tests pass—but authorization? Scramble PRs/Jira/Slack.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 pb-8">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-muted border-2 border-muted-foreground flex items-center justify-center">
                            <BarChartIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="font-semibold text-lg">Status Lost</h3>
                            <p className="text-muted-foreground text-sm">
                                "Done?" Jira stale, Slack archived, GitHub code-only. No trust.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="font-semibold text-lg">Billing Fight</h3>
                            <p className="text-muted-foreground text-sm">
                                No proof doc. Days lost arguing what was obvious.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
