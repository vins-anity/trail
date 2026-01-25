export default function ServicesPage() {
    return (
        <div className="py-24 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold mb-6 tracking-tight">
                    The Delivery Supply Chain
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    End-to-end verification for your software factory. From commit to cash.
                </p>
            </div>

            <div className="space-y-24">
                {/* Stage 1 */}
                <div className="md:grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4 order-2 md:order-1">
                        <h2 className="text-3xl font-bold">1. Passive Ingestion</h2>
                        <p className="text-lg text-muted-foreground">
                            We hook into your existing tools (GitHub, Jira). No manual data
                            entry required.
                        </p>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-center gap-2">✓ Detects PR merges</li>
                            <li className="flex items-center gap-2">✓ Links Jira tickets</li>
                            <li className="flex items-center gap-2">✓ Captures build status</li>
                        </ul>
                    </div>
                    <div className="bg-muted aspect-video rounded-xl flex items-center justify-center order-1 md:order-2 border border-border">
                        <span className="text-muted-foreground">
                            Ingestion Diagram Placeholder
                        </span>
                    </div>
                </div>

                {/* Stage 2 */}
                <div className="md:grid md:grid-cols-2 gap-12 items-center">
                    <div className="bg-muted aspect-video rounded-xl flex items-center justify-center border border-border">
                        <span className="text-muted-foreground">
                            Verification Engine Placeholder
                        </span>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">2. The "Docket" Engine</h2>
                        <p className="text-lg text-muted-foreground">
                            Our Verification Engine checks the evidence against your policy.
                        </p>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-center gap-2">✓ "Is code reviewed?"</li>
                            <li className="flex items-center gap-2">✓ "Did tests pass?"</li>
                            <li className="flex items-center gap-2">✓ "Is it deployed?"</li>
                        </ul>
                    </div>
                </div>

                {/* Stage 3 */}
                <div className="md:grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4 order-2 md:order-1">
                        <h2 className="text-3xl font-bold">3. Proof Packet Generation</h2>
                        <p className="text-lg text-muted-foreground">
                            We mint a cryptographically signed Proof Packet that you can share
                            with clients.
                        </p>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-center gap-2">✓ Public Share Links</li>
                            <li className="flex items-center gap-2">✓ PDF Exports</li>
                            <li className="flex items-center gap-2">
                                ✓ Client-friendly summaries
                            </li>
                        </ul>
                    </div>
                    <div className="bg-muted aspect-video rounded-xl flex items-center justify-center order-1 md:order-2 border border-border">
                        <span className="text-muted-foreground">
                            Proof Packet UI Placeholder
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
