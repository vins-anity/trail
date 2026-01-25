import { LandingLayout } from "@/components/layout/LandingLayout";

export function WhyPage() {
    return (
        <LandingLayout>
            <div className="py-24 px-6 max-w-5xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6 tracking-tight">The ROI of Trust</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16">
                    ShipDocket isn't just a status update tool. It's a revenue acceleration platform.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="p-8 border border-border rounded-xl bg-card">
                        <span className="text-4xl font-bold text-primary block mb-2">30%</span>
                        <p className="font-semibold text-lg">Faster Invoice Approval</p>
                        <p className="text-sm text-muted-foreground mt-2">When clients have a verified Proof Packet, they pay faster.</p>
                    </div>
                    <div className="p-8 border border-border rounded-xl bg-card">
                        <span className="text-4xl font-bold text-primary block mb-2">Zero</span>
                        <p className="font-semibold text-lg">Billing Disputes</p>
                        <p className="text-sm text-muted-foreground mt-2">Eliminate "did you really work on this?" conversations forever.</p>
                    </div>
                    <div className="p-8 border border-border rounded-xl bg-card">
                        <span className="text-4xl font-bold text-primary block mb-2">90%</span>
                        <p className="font-semibold text-lg">Less Admin Time</p>
                        <p className="text-sm text-muted-foreground mt-2">Automated collection of evidence means PMs can focus on delivery.</p>
                    </div>
                </div>

                <div className="bg-muted/30 p-12 rounded-2xl border border-border text-left md:flex gap-12 items-center">
                    <div className="flex-1 space-y-4">
                        <h2 className="text-3xl font-bold">Enterprise-Grade Security</h2>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <span className="bg-primary/20 text-primary p-1 rounded-full text-xs">✓</span>
                                <span><strong>Metadata Only:</strong> We never clone or read your source code.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="bg-primary/20 text-primary p-1 rounded-full text-xs">✓</span>
                                <span><strong>SOC2 Ready:</strong> Built on compliant infrastructure (Render/Supabase).</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="bg-primary/20 text-primary p-1 rounded-full text-xs">✓</span>
                                <span><strong>Tamper-Evident:</strong> All events are hash-chained for auditability.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-shrink-0 mt-8 md:mt-0">
                        {/* Placeholder for Security Badges */}
                        <div className="w-64 h-32 bg-background border border-border rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                            Security Badges
                        </div>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}
