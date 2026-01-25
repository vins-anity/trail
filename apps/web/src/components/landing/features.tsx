import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export function LandingFeatures() {
    return (
        <section id="features" className="max-w-6xl mx-auto px-6 py-24 space-y-16">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">The Delivery Supply Chain</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    From commitment to cash in 4 automated stages.
                </p>
            </div>

            <div className="space-y-8">
                {/* Stage 1 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">
                            Stage 1: The Manifest
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            When a dev moves a ticket in Jira, ShipDocket 'manifests' the item.
                            It’s now on the official record. No new tools, no manual start buttons.
                        </p>
                        <p className="text-sm font-semibold text-primary pt-2">
                            Key Benefit: Formalizes intent instantly.
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Prevents misaligned expectations</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Creates first audit entry</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-8 space-y-3">
                        <div className="font-mono text-sm text-muted-foreground bg-background rounded p-3">
                            Slack: "John, can you fix login timeout?"
                            <br />
                            <span className="text-green-600">✓ John accepted task</span>
                            <br />
                            <span className="text-xs text-muted-foreground mt-2 block">
                                2026-01-10 14:30 UTC
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stage 2 */}
                <div className="grid md:grid-cols-2 gap-8 items-center md:order-2">
                    <div className="space-y-4 md:order-2">
                        <h3 className="text-2xl font-bold">Stage 2: The Cargo</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We attach the digital cargo: GitHub PRs, CI test results, and
                            approvals. Every event is hash-chained to ensure it can't be faked.
                        </p>
                        <p className="text-sm font-semibold text-primary pt-2">
                            Key Benefit: Indisputable proof of execution.
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>PR merged + reviewed + tested</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>All metadata timestamped</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-8 space-y-2 md:order-1">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                            Evidence Summary
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-background rounded">
                                <CheckCircledIcon className="w-4 h-4 text-green-600" />
                                <span>PR #123 merged</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-background rounded">
                                <CheckCircledIcon className="w-4 h-4 text-green-600" />
                                <span>1 approval received</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-background rounded">
                                <CheckCircledIcon className="w-4 h-4 text-green-600" />
                                <span>CI checks passed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stage 3 */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">
                            Stage 3: The Inspection
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            If tests pass and code is reviewed, ShipDocket proposes closure. It
                            auto-closes in 24h unless you veto. Speed with control.
                        </p>
                        <p className="text-sm font-semibold text-primary pt-2">
                            Key Benefit: Removes the project manager bottleneck.
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Auto-close timer (e.g. 24h)</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Manager veto stops closure</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-8 space-y-3">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                            Lead Approval Gate
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">
                                Auto-closing in 23h 45m...
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" className="flex-1">
                                    Approve Now
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                >
                                    Veto & Explain
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stage 4 */}
                <div className="grid md:grid-cols-2 gap-8 items-center md:order-2">
                    <div className="space-y-4 md:order-2">
                        <h3 className="text-2xl font-bold">
                            Stage 4: The Proof Packet
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            A client-ready link generated automatically. AI summarizes
                            technical logs into business value language your client
                            understands.
                        </p>
                        <p className="text-sm font-semibold text-primary pt-2">
                            Key Benefit: Attach to invoice → Get paid.
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Web, PDF, JSON export</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>Hash-chain integrity verification</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-card rounded-xl border border-border p-8 space-y-3 md:order-1">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">
                            Proof Packet Preview
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground font-mono bg-background rounded p-3">
                            <div>PP-PROJ-101-20260112</div>
                            <div className="text-foreground font-semibold">
                                Fix login timeout
                            </div>
                            <div className="text-xs text-gray-500 italic my-1">
                                "Resolved session expiry issue ensuring users stay logged in for
                                extended duration."
                            </div>
                            <div>Approved by sarah@example.com</div>
                            <div>Jan 11, 2026 10:15 AM UTC</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
