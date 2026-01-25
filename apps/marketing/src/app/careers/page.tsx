export default function CareersPage() {
    return (
        <div className="py-24 px-6 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 tracking-tight">Join the Crew</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                We're building the logistics layer for the software industry. Help us ship
                trust.
            </p>

            <div className="bg-muted/30 border border-border rounded-2xl p-12">
                <h2 className="text-2xl font-bold mb-4">No Open Positions</h2>
                <p className="text-muted-foreground mb-8">
                    We are currently fully staffed, but we're always looking for talented
                    engineers and agency veterans.
                </p>
                <a
                    href="mailto:careers@shipdocket.com"
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                    Email Us
                </a>
            </div>

            <div className="mt-24 grid md:grid-cols-3 gap-8 text-left">
                <div className="space-y-2">
                    <h3 className="font-bold text-lg">Remote First</h3>
                    <p className="text-sm text-muted-foreground">
                        Work from anywhere. We verify output, not seat time.
                    </p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-lg">Async Culture</h3>
                    <p className="text-sm text-muted-foreground">
                        Write it down. Ship it. No unnecessary meetings.
                    </p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-lg">Agency DNA</h3>
                    <p className="text-sm text-muted-foreground">
                        We understand the service business because we lived it.
                    </p>
                </div>
            </div>
        </div>
    );
}
