import { ArrowRightIcon, CheckCircledIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function LandingHero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-20 bg-brand-light font-sans">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-brand-accent-blue/5 rounded-full blur-[100px] animate-slower-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-brand-accent-orange/5 rounded-full blur-[100px] animate-slower-pulse animation-delay-2000" />
            </div>

            <div className="relative z-10 max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
                {/* Left column: Headline and CTA */}
                <div className="flex flex-col space-y-10 animate-fade-in-up">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-dark/[0.03] border border-brand-dark/[0.05] w-fit">
                            <span className="flex h-2 w-2 rounded-full bg-brand-accent-green animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-mid">
                                Now in Public Beta
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black font-heading leading-[1.05] tracking-tight text-brand-dark">
                            Turn <span className="text-brand-accent-orange">Commits</span>
                            <br />
                            into <span className="text-brand-accent-blue">Contracts</span>.
                        </h1>

                        <p className="text-xl md:text-2xl text-brand-gray-mid leading-relaxed max-w-xl font-serif font-light">
                            Stop defending your invoices. ShipDocket creates an automated{" "}
                            <span className="text-brand-dark font-medium italic">
                                'Bill of Lading'
                            </span>{" "}
                            for your code—turning Jira tickets and PRs into verified Proof Packets.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <a href="/demo">
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-xl text-base font-bold bg-brand-dark text-brand-light hover:bg-black hover:scale-105 transition-all duration-300 shadow-xl shadow-brand-dark/20 flex items-center gap-3 w-fit"
                            >
                                Get Started Free <ArrowRightIcon className="w-5 h-5" />
                            </Button>
                        </a>
                        <a
                            href="https://calendly.com/shipdocket/demo"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 rounded-xl text-base font-bold border-brand-gray-mid/30 text-brand-dark hover:bg-white hover:border-brand-dark/20 hover:text-brand-dark hover:shadow-lg transition-all duration-300 w-fit"
                            >
                                Book a Demo
                            </Button>
                        </a>
                    </div>

                    <div className="border-t border-brand-gray-light pt-8">
                        <p className="font-bold text-xs uppercase tracking-widest text-brand-gray-mid mb-4">
                            Trusted Architecture
                        </p>
                        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-brand-dark/70 font-medium">
                            <span className="flex items-center gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-brand-accent-green" />
                                Zero Code Access
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-brand-accent-green" />
                                Tamper-Proof Hash Chain
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircledIcon className="w-4 h-4 text-brand-accent-green" />
                                SOC2-Ready
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right column: Proof Packet Visual Example */}
                <div className="relative hidden md:flex items-center justify-center animate-fade-in-up animation-delay-500">
                    <div className="relative w-full max-w-md perspective-1000">
                        {/* Glow background */}
                        <div className="absolute -inset-10 bg-gradient-to-tr from-brand-accent-blue/20 via-brand-accent-purple/10 to-brand-accent-orange/20 rounded-[3rem] blur-3xl opacity-70 animate-pulse" />

                        {/* Main card */}
                        <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 space-y-8 shadow-2xl transform rotate-y-6 hover:rotate-y-0 transition-transform duration-700 ease-out">
                            {/* Header */}
                            <div className="space-y-3 pb-6 border-b border-brand-gray-light">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-brand-accent-blue uppercase tracking-widest px-2 py-1 rounded bg-brand-accent-blue/10">
                                        Official Proof Packet #402
                                    </span>
                                    <LockClosedIcon className="w-4 h-4 text-brand-gray-mid" />
                                </div>
                                <h3 className="text-2xl font-black font-heading text-brand-dark uppercase tracking-tight">
                                    Delivered & Verified
                                </h3>
                                <p className="text-brand-gray-mid font-medium text-lg">
                                    User Authentication Refactor
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-1 rounded bg-brand-light border border-brand-gray-light">
                                        <div className="w-2 h-2 rounded-full bg-brand-accent-orange" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-gray-mid uppercase tracking-wider mb-0.5">
                                            Manifested
                                        </p>
                                        <p className="text-sm font-semibold text-brand-dark">
                                            Jan 10 • Jira #202
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-1 rounded bg-brand-light border border-brand-gray-light">
                                        <div className="w-2 h-2 rounded-full bg-brand-accent-blue" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-gray-mid uppercase tracking-wider mb-0.5">
                                            Cargo
                                        </p>
                                        <p className="text-sm font-semibold text-brand-dark">
                                            12 Commits, 2 PRs, CI Passed
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-1 rounded bg-brand-light border border-brand-gray-light">
                                        <div className="w-2 h-2 rounded-full bg-brand-accent-green" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-gray-mid uppercase tracking-wider mb-0.5">
                                            Authorized
                                        </p>
                                        <p className="text-sm font-semibold text-brand-dark">
                                            Jan 12 • Auto-closed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Evidence Summary */}
                            <div className="bg-brand-light/50 border border-brand-gray-light/50 rounded-2xl p-6 space-y-3">
                                <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                                    Verified Evidence
                                </p>
                                <div className="space-y-3">
                                    {[
                                        "PR #847 merged with 2 approvals",
                                        "All CI checks passed (142 tests)",
                                        "Code review completed by @senior-dev",
                                        "Hash chain verified: a7f3e9...",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-3 text-xs font-medium text-brand-gray-mid"
                                        >
                                            <CheckCircledIcon className="w-4 h-4 text-brand-accent-green flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-accent-green/10 rounded-lg">
                                    <CheckCircledIcon className="w-4 h-4 text-brand-accent-green" />
                                    <span className="text-[10px] font-bold text-brand-accent-green uppercase tracking-wider">
                                        Ready for Invoicing
                                    </span>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-brand-dark flex items-center justify-center text-brand-light font-bold text-xs shadow-lg">
                                    SD
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-mid">
                    Scroll for more
                </span>
                <div className="w-5 h-8 border-2 border-brand-gray-mid rounded-full flex items-start justify-center pt-2">
                    <div className="w-1 h-1.5 bg-brand-gray-mid rounded-full" />
                </div>
            </div>
        </section>
    );
}
