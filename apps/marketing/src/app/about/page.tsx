export default function AboutPage() {
    return (
        <div className="py-24 px-6 max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-6 tracking-tight">
                    Built by Agency Owners, for Agency Owners
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    We spent a decade running software service businesses. We know the pain of
                    "micro-management" calls and billing disputes.
                </p>
            </div>

            <div className="md:grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold">The "Black Box" Problem</h2>
                    <p className="text-lg text-muted-foreground">
                        Clients don't trust what they can't see. When development happens in a
                        "black box," anxiety goes up, and trust goes down.
                    </p>
                    <p className="text-lg text-muted-foreground">
                        We realized that **metadata**—commits, PRs, and builds—is the perfect
                        "shipping manifest" for software. It proves effort and progress without
                        revealing sensitive IP.
                    </p>
                </div>
                <div className="bg-muted p-8 rounded-2xl border border-border">
                    <div className="text-center space-y-2">
                        <span className="text-6xl font-black text-primary/20">10+</span>
                        <p className="font-semibold">Years in Agency Services</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-border pt-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-2xl font-medium text-foreground max-w-3xl mx-auto leading-normal">
                    "To create the universal standard for verifying software delivery, making
                    the 'Logistics of Trust' automatic for everyone."
                </p>
            </div>
        </div>
    );
}
