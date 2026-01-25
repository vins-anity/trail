import { PersonIcon, ReaderIcon } from "@radix-ui/react-icons";

export function LandingWhy() {
    return (
        <section className="relative py-24 overflow-hidden border-t border-border bg-card/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-5xl font-bold leading-tight">
                            Why We Built ShipDocket
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We ran a software agency for 10 years. We hated 'explaining' bills.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            The Logistics of Trust. In the shipping industry, you don't argue about
                            delivery—you check the Bill of Lading. Software should be no different.
                        </p>
                        <div className="space-y-4 pt-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <PersonIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Built for Business</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Developers stay in their flow. You get a business asset that
                                        proves value without micromanagement.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <ReaderIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Zero IP Risk</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We verify the shipping container (metadata), we never open
                                        the box (source code). Your IP is safe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/20 rounded-2xl p-12 flex items-center justify-center min-h-96">
                        <div className="text-center space-y-4">
                            <ReaderIcon className="w-24 h-24 text-primary mx-auto opacity-20" />
                            <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                                Verified Logistics
                            </p>
                            <p className="text-muted-foreground">
                                Don't just invoice. Send a Proof Packet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
