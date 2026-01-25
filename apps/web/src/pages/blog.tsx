import { LandingLayout } from "@/components/layout/LandingLayout";

export function BlogPage() {
    return (
        <LandingLayout>
            <div className="py-24 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Product Updates</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        The latest features and integrations from the ShipDocket dry docks.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Article 1 */}
                    <div className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                        <div className="h-48 bg-muted flex items-center justify-center border-b border-border">
                            <span className="text-muted-foreground">Image</span>
                        </div>
                        <div className="p-6">
                            <div className="text-xs text-primary font-medium mb-2">Coming Soon</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Deep Proof: Verify Build Artifacts</h3>
                            <p className="text-sm text-muted-foreground">
                                Introducing a new way to verify not just the code, but the binary itself.
                            </p>
                        </div>
                    </div>

                    {/* Article 2 */}
                    <div className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                        <div className="h-48 bg-muted flex items-center justify-center border-b border-border">
                            <span className="text-muted-foreground">Image</span>
                        </div>
                        <div className="p-6">
                            <div className="text-xs text-primary font-medium mb-2">Integration</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Linear Integration Beta</h3>
                            <p className="text-sm text-muted-foreground">
                                Connect your Linear workspace to ShipDocket for seamless status tracking.
                            </p>
                        </div>
                    </div>

                    {/* Article 3 */}
                    <div className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                        <div className="h-48 bg-muted flex items-center justify-center border-b border-border">
                            <span className="text-muted-foreground">Image</span>
                        </div>
                        <div className="p-6">
                            <div className="text-xs text-primary font-medium mb-2">Announcement</div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Introducing ShipDocket V1</h3>
                            <p className="text-sm text-muted-foreground">
                                We are live! Learn how we are changing the way agencies bill clients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}
