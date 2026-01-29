import { CheckCircledIcon } from "@radix-ui/react-icons";
import { IconBuilding, IconFileCheck, IconPackage, IconShieldCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function LandingFeatures() {
    return (
        <section id="features" className="relative py-32 overflow-hidden bg-white">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gray-light to-transparent" />

            <div className="max-w-7xl mx-auto px-6 space-y-24">
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-light shadow-sm mb-4">
                        <IconPackage className="w-8 h-8 text-brand-dark" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-heading text-brand-dark tracking-tight">
                        The Delivery Supply Chain
                    </h2>
                    <p className="text-xl text-brand-gray-mid font-serif leading-relaxed">
                        From commitment to cash in 4 automated stages. We bring supply chain rigour
                        to software delivery.
                    </p>
                </div>

                <div className="space-y-20 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[50%] top-0 bottom-0 w-px bg-brand-gray-light hidden md:block" />

                    {/* Stage 1 */}
                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center relative group">
                        <div className="md:text-right space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-3 mb-2 md:flex-row-reverse">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white font-bold text-sm shadow-lg">
                                    1
                                </span>
                                <h3 className="text-2xl font-bold font-heading text-brand-dark">
                                    The Manifest
                                </h3>
                            </div>
                            <p className="text-brand-gray-mid text-lg leading-relaxed">
                                When a dev moves a ticket in Jira, ShipDocket 'manifests' the item.
                                It’s now on the official record. No new tools, no manual start
                                buttons.
                            </p>
                            <div className="bg-brand-light p-4 rounded-xl border border-brand-gray-light/50 inline-block text-left">
                                <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                                    Key Benefit
                                </p>
                                <ul className="space-y-2 text-sm text-brand-gray-mid font-medium">
                                    <li className="flex gap-2">
                                        <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                                        <span>Prevents misaligned expectations</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                                        <span>Creates first audit entry</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-brand-light rounded-2xl border border-brand-gray-light p-8 shadow-sm group-hover:shadow-md transition-all duration-500 relative z-10">
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-accent-orange animate-pulse" />
                            <div className="font-mono text-sm text-brand-gray-mid bg-white rounded-xl p-6 border border-brand-gray-light/50 shadow-inner">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-8 h-8 rounded bg-brand-accent-blue/20 flex-shrink-0" />
                                    <div className="space-y-2 w-full">
                                        <div className="h-2 bg-brand-gray-light rounded w-3/4" />
                                        <div className="h-2 bg-brand-gray-light rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="pl-11 space-y-2">
                                    <p className="text-brand-dark font-bold">
                                        Slack: "John, can you fix login timeout?"
                                    </p>
                                    <div className="flex items-center gap-2 text-brand-accent-green font-bold text-xs bg-brand-accent-green/5 px-2 py-1 rounded w-fit">
                                        <CheckCircledIcon className="w-3 h-3" />
                                        John accepted task
                                    </div>
                                    <span className="text-[10px] text-brand-gray-mid/70 block font-sans">
                                        2026-01-10 14:30 UTC • Manifest ID: #MNF-992
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stage 2 */}
                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center relative group">
                        <div className="bg-brand-light rounded-2xl border border-brand-gray-light p-8 shadow-sm group-hover:shadow-md transition-all duration-500 relative z-10 md:order-1 sm:order-2">
                            <div className="font-sans text-xs font-bold text-brand-gray-mid uppercase tracking-wider mb-4 border-b border-brand-gray-light pb-2">
                                Evidence Summary
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-brand-gray-light/50 shadow-sm">
                                    <div className="flex items-center gap-3 text-sm font-bold text-brand-dark">
                                        <IconBuilding className="w-4 h-4 text-brand-accent-blue" />
                                        <span>PR #123 merged</span>
                                    </div>
                                    <CheckCircledIcon className="w-4 h-4 text-brand-accent-green" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-brand-gray-light/50 shadow-sm">
                                    <div className="flex items-center gap-3 text-sm font-bold text-brand-dark">
                                        <IconShieldCheck className="w-4 h-4 text-brand-accent-orange" />
                                        <span>1 approval received</span>
                                    </div>
                                    <CheckCircledIcon className="w-4 h-4 text-brand-accent-green" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-brand-gray-light/50 shadow-sm">
                                    <div className="flex items-center gap-3 text-sm font-bold text-brand-dark">
                                        <IconFileCheck className="w-4 h-4 text-brand-accent-purple" />
                                        <span>CI checks passed</span>
                                    </div>
                                    <CheckCircledIcon className="w-4 h-4 text-brand-accent-green" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 md:order-2 sm:order-1 relative z-10">
                            <div className="inline-flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white font-bold text-sm shadow-lg">
                                    2
                                </span>
                                <h3 className="text-2xl font-bold font-heading text-brand-dark">
                                    The Cargo
                                </h3>
                            </div>
                            <p className="text-brand-gray-mid text-lg leading-relaxed">
                                We attach the digital cargo: GitHub PRs, CI test results, and
                                approvals. Every event is hash-chained to ensure it can't be faked.
                            </p>
                            <div className="bg-brand-light p-4 rounded-xl border border-brand-gray-light/50 inline-block">
                                <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                                    Key Benefit
                                </p>
                                <ul className="space-y-2 text-sm text-brand-gray-mid font-medium">
                                    <li className="flex gap-2">
                                        <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                                        <span>PR merged + reviewed + tested</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                                        <span>All metadata timestamped & chained</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Stage 3 */}
                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center relative group">
                        <div className="md:text-right space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-3 mb-2 md:flex-row-reverse">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white font-bold text-sm shadow-lg">
                                    3
                                </span>
                                <h3 className="text-2xl font-bold font-heading text-brand-dark">
                                    The Inspection
                                </h3>
                            </div>
                            <p className="text-brand-gray-mid text-lg leading-relaxed">
                                If tests pass and code is reviewed, ShipDocket proposes closure. It
                                auto-closes in 24h unless you veto. Speed with control.
                            </p>
                            <div className="bg-brand-light p-4 rounded-xl border border-brand-gray-light/50 inline-block text-left">
                                <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                                    Key Benefit
                                </p>
                                <ul className="space-y-2 text-sm text-brand-gray-mid font-medium">
                                    <li className="flex gap-2">
                                        <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                                        <span>Auto-close timer (e.g. 24h)</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                                        <span>Manager veto stops closure</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-brand-light rounded-2xl border border-brand-gray-light p-8 shadow-sm group-hover:shadow-md transition-all duration-500 relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                                    Lead Approval Gate
                                </div>
                                <div className="px-2 py-0.5 rounded bg-brand-accent-orange/10 text-brand-accent-orange text-[10px] font-bold uppercase animate-pulse">
                                    Action Required
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-brand-gray-light p-6 space-y-4">
                                <p className="text-sm font-medium text-brand-dark text-center">
                                    Auto-closing in{" "}
                                    <span className="font-bold tabular-nums">23h 45m 12s</span>...
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-brand-accent-green hover:bg-brand-accent-green/90 text-white font-bold rounded-lg shadow-sm"
                                    >
                                        Approve Now
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 bg-transparent border-brand-gray-light hover:bg-brand-light text-brand-dark font-medium rounded-lg"
                                    >
                                        Veto & Explain
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stage 4 */}
                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center relative group">
                        <div className="bg-brand-light rounded-2xl border border-brand-gray-light p-8 shadow-sm group-hover:shadow-md transition-all duration-500 relative z-10 md:order-1 sm:order-2">
                            <div className="flex items-center gap-2 mb-4 p-2 bg-brand-dark rounded-lg w-fit shadow-lg transform -rotate-2">
                                <IconShieldCheck className="w-4 h-4 text-brand-light" />
                                <span className="text-xs font-bold text-brand-light uppercase tracking-wider">
                                    Proof Packet
                                </span>
                            </div>
                            <div className="space-y-4 font-mono text-xs bg-white rounded-xl p-6 border border-brand-gray-light shadow-inner">
                                <div className="flex justify-between text-brand-gray-mid">
                                    <span>ID: PP-PROJ-101-20260112</span>
                                    <span>HASH: a7f3...9c2</span>
                                </div>
                                <div className="h-px bg-brand-gray-light/50" />
                                <div className="text-brand-dark font-bold text-sm">
                                    Fix login timeout
                                </div>
                                <div className="text-brand-gray-mid italic pl-3 border-l-2 border-brand-accent-blue/30">
                                    "Resolved session expiry issue ensuring users stay logged in for
                                    extended duration."
                                </div>
                                <div className="h-px bg-brand-gray-light/50" />
                                <div className="flex justify-between items-center bg-brand-accent-green/5 p-2 rounded">
                                    <span className="text-brand-dark font-semibold">
                                        Approved by sarah@example.com
                                    </span>
                                    <IconBuilding className="w-3 h-3 text-brand-accent-green" />
                                </div>
                                <div className="text-brand-gray-mid text-[10px] text-right">
                                    Jan 11, 2026 10:15 AM UTC
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 md:order-2 sm:order-1 relative z-10">
                            <div className="inline-flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white font-bold text-sm shadow-lg">
                                    4
                                </span>
                                <h3 className="text-2xl font-bold font-heading text-brand-dark">
                                    The Proof Packet
                                </h3>
                            </div>
                            <p className="text-brand-gray-mid text-lg leading-relaxed">
                                A client-ready link generated automatically. AI summarizes technical
                                logs into business value language your client understands.
                            </p>
                            <div className="bg-brand-light p-4 rounded-xl border border-brand-gray-light/50 inline-block">
                                <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                                    Key Result
                                </p>
                                <ul className="space-y-2 text-sm text-brand-gray-mid font-medium">
                                    <li className="flex gap-2">
                                        <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                                        <span>Web, PDF, JSON export</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0 mt-0.5" />
                                        <span>Attach to invoice → Get paid</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
