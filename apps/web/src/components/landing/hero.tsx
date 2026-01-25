import {
    ArrowRightIcon,
    CheckCircledIcon,
    LockClosedIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function LandingHero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-40 left-10 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
                {/* Left column: Headline and CTA */}
                <div className="flex flex-col space-y-8">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-balance">
                        <span className="block">Turn</span>
                        <span className="block text-primary">Commits</span>
                        <span className="block">into Contracts.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-light">
                        Stop defending your invoices. ShipDocket creates an automated
                        'Bill of Lading' for your code—turning Jira tickets and GitHub merges
                        into verified Proof Packets that get you paid faster.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            size="lg"
                            className="gap-2 rounded-full px-8 text-base font-semibold w-fit"
                        >
                            Start Shipping (Free Beta) <ArrowRightIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-8 text-base font-semibold bg-transparent w-fit"
                        >
                            See a Sample Proof Packet
                        </Button>
                    </div>

                    <div className="border-t border-border/30 pt-6 text-sm text-muted-foreground">
                        <p className="font-medium uppercase tracking-wider text-[10px] opacity-70">
                            🔒 Zero Code Access (Metadata Only) • 🔗 Tamper-Proof Hash Chain • 🛡️ SOC2-Ready Architecture
                        </p>
                    </div>
                </div>

                {/* Right column: Proof Packet Visual Example */}
                <div className="relative hidden md:flex items-center justify-center">
                    <div className="relative w-full max-w-sm">
                        {/* Glow background */}
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-2xl blur-2xl opacity-60 animate-pulse" />

                        {/* Main card */}
                        <div className="relative bg-card border-2 border-primary/30 rounded-2xl p-8 space-y-6 shadow-2xl">
                            {/* Header */}
                            <div className="space-y-2 pb-4 border-b border-border/30">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                                        OFFICIAL PROOF PACKET #402
                                    </span>
                                    <LockClosedIcon className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground uppercase">
                                    DELIVERED & VERIFIED
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    User Authentication Refactor
                                </p>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg w-fit">
                                <CheckCircledIcon className="w-4 h-4 text-primary" />
                                <span className="text-xs font-semibold text-primary">
                                    VERIFIED & APPROVED
                                </span>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                                        Manifested
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                        Jan 10 • Jira #202
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                                        Cargo
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                        12 Commits, 2 PRs, CI Passed
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                                        Authorized
                                    </p>
                                    <p className="text-sm font-medium text-foreground">
                                        Jan 12 • Auto-closed
                                    </p>
                                </div>
                            </div>

                            {/* Evidence Summary */}
                            <div className="bg-background rounded-lg p-4 space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                                    Evidence Summary
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-600" />
                                        <span className="text-muted-foreground">
                                            PR #847 merged with 2 approvals
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-600" />
                                        <span className="text-muted-foreground">
                                            All CI checks passed
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-600" />
                                        <span className="text-muted-foreground">
                                            Code review completed
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-600" />
                                        <span className="text-muted-foreground">
                                            Hash chain verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-border/30 pt-4 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-mono">
                                    Hash: <span className="text-primary">a7f3e9c2...</span>
                                </p>
                                <span className="text-[10px] font-bold text-primary uppercase">
                                    Ready for Invoicing
                                </span>
                            </div>
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs text-muted-foreground">See how it works</span>
                <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex items-start justify-center pt-2">
                    <div className="w-1 h-2 bg-muted-foreground rounded-full" />
                </div>
            </div>
        </section>
    );
}
