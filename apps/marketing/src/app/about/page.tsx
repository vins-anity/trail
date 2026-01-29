import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
    return (
        <div className="bg-brand-light min-h-screen">
            {/* Manifesto Section */}
            <div className="py-24 px-6 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    <Badge
                        variant="outline"
                        className="border-brand-accent-blue text-brand-dark px-4 py-1 rounded-full text-sm font-medium"
                    >
                        OUR ORIGIN STORY
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight text-brand-dark">
                        Built by <span className="text-brand-accent-blue">Agency Owners</span>,{" "}
                        <br />
                        for Agency Owners.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        We spent a decade running software service businesses. We know the pain of
                        "micro-management" calls and billing disputes.
                    </p>
                </div>

                {/* The Problem / Solution Split */}
                <div className="grid md:grid-cols-2 gap-12 items-center py-12">
                    <div className="space-y-6">
                        <div className="h-1.5 w-24 bg-brand-accent-orange rounded-full"></div>
                        <h2 className="text-4xl font-heading font-bold text-brand-dark">
                            The "Black Box" Problem
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Clients don't trust what they can't see. When development happens in a
                            "black box," anxiety goes up, and trust goes down.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed p-6 bg-white border-l-4 border-brand-accent-orange rounded-r-xl shadow-sm">
                            We realized that{" "}
                            <strong className="text-brand-dark font-semibold">metadata</strong>
                            —commits, PRs, and builds—is the perfect "shipping manifest" for
                            software. It proves effort and progress without revealing sensitive IP.
                        </p>
                    </div>

                    {/* Stat Card */}
                    <div className="bg-brand-dark text-brand-light p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="text-center space-y-2 relative z-10">
                            <span className="text-8xl font-heading font-black text-brand-light tracking-tighter">
                                10+
                            </span>
                            <p className="font-medium text-brand-gray-mid text-lg uppercase tracking-widest">
                                Years in Agency Services
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mission Statement */}
                <div className="border-t border-brand-gray-mid/30 pt-24 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gray-mid mb-8">
                        我们的使命 OUR MISSION
                    </h2>
                    <p className="text-3xl md:text-5xl font-heading font-medium text-brand-dark max-w-4xl mx-auto leading-tight">
                        "To create the universal standard for verifying software delivery, making
                        the{" "}
                        <span className="text-brand-accent-green decoration-4 underline-offset-4 underline decoration-brand-accent-green/30">
                            Logistics of Trust
                        </span>{" "}
                        automatic for everyone."
                    </p>
                </div>
            </div>
        </div>
    );
}
