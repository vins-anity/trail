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
                    <h2 className="text-4xl font-bold uppercase tracking-tight">The Invoice Gap</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        You ship code. You bill for hours. The client pays for trust. When
                        those don't align, you don't get paid.
                    </p>
                </div>

                <div className="space-y-6 max-w-3xl mx-auto relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent leading-3" />

                    <div className="flex gap-6 pb-8">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                            <PersonIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="font-semibold text-lg">The Black Box</h3>
                            <p className="text-muted-foreground text-sm">
                                Your team spent 40 hours on backend migrations. The client sees
                                nothing. To them, the work didn't happen.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 pb-8">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-muted border-2 border-muted-foreground flex items-center justify-center">
                            <CodeIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="font-semibold text-lg">The 'Status' Chase</h3>
                            <p className="text-muted-foreground text-sm">
                                Clients ask 'Is it done?' because Jira is stale and Slack is
                                noisy. You lose billable hours acting as a human status bot.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 pb-8">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-muted border-2 border-muted-foreground flex items-center justify-center">
                            <BarChartIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="font-semibold text-lg">Invoice Friction</h3>
                            <p className="text-muted-foreground text-sm">
                                You send the bill. They ask for 'details.' You scramble to find
                                screenshots and git logs just to defend your revenue.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <h3 className="font-semibold text-lg font-mono opacity-50 italic">
                                REVENUE AT RISK
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
