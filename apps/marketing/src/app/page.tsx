import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";
import { WordFlip } from "@/components/ui/word-flip";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-brand-light text-brand-dark overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent-orange rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent-blue rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gray-light/50 border border-brand-gray-mid/30 text-sm font-medium text-brand-dark animate-fade-in">
                        <span className="flex h-2 w-2 rounded-full bg-brand-accent-green"></span>
                        The Trust Protocol for Software Agencies
                    </div>

                    <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tight text-brand-dark leading-[1.1]">
                        <span className="inline-block animate-hero-word-1">Turn </span>
                        <WordFlip
                            pairs={[
                                { from: "Commits", to: "Contracts" },
                                { from: "Code", to: "Trust" },
                                { from: "Hours", to: "Revenue" },
                                { from: "Work", to: "Proof" },
                                { from: "Sprints", to: "Value" },
                                { from: "Logs", to: "Certainty" },
                            ]}
                            position="from"
                            className="text-brand-accent-blue mx-2"
                        />
                        <br className="hidden md:block" />
                        <span className="inline-block animate-hero-word-2">into </span>
                        <WordFlip
                            pairs={[
                                { from: "Commits", to: "Contracts" },
                                { from: "Code", to: "Trust" },
                                { from: "Hours", to: "Revenue" },
                                { from: "Work", to: "Proof" },
                                { from: "Sprints", to: "Value" },
                                { from: "Logs", to: "Certainty" },
                            ]}
                            position="to"
                            className="text-brand-accent-orange mx-2"
                        />
                        <span className="animate-hero-word-3">.</span>
                    </h1>

                    <p
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed animate-slide-up"
                        style={{ animationDelay: "0.1s" }}
                    >
                        Make your delivery indisputable. ShipDocket transforms your team's output
                        into verifiable 'Proof Packets'—so you get paid for the value you ship, not
                        just the hours you log.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <Link href="http://localhost:5173/onboarding">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg rounded-full bg-brand-dark text-brand-light hover:bg-brand-accent-orange transition-colors"
                            >
                                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full border-brand-gray-mid hover:bg-white hover:text-brand-dark hover:border-brand-dark transition-colors"
                        >
                            Read the Manifesto
                        </Button>
                    </div>
                </div>
            </section>

            {/* Social Proof / Trust Bar */}
            <section className="py-12 border-y border-brand-gray-mid/20 bg-white/50">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-8">
                        TRUSTED BY FORWARD-THINKING AGENCIES
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos - implementing as accessible text for now */}
                        <div className="text-2xl font-heading font-bold">Acme Corp</div>
                        <div className="text-2xl font-heading font-bold">Globex</div>
                        <div className="text-2xl font-heading font-bold">Soylent</div>
                        <div className="text-2xl font-heading font-bold">Initech</div>
                    </div>
                </div>
            </section>

            {/* The Invoice Gap Section - Cinematic Timeline */}
            <section className="py-24 px-6 bg-brand-light relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-accent-blue/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-brand-accent-orange/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-24 space-y-6">
                        <Badge className="bg-brand-dark/5 text-brand-dark border-brand-dark/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                            The Problem
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-brand-dark tracking-tight leading-[1.1]">
                            THE INVOICE GAP
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground font-serif italic max-w-2xl mx-auto">
                            Engineering is complex. Billing should be binary.{" "}
                            <br className="hidden md:block" />
                            When you can't prove the work, you don't get paid.
                        </p>
                    </div>

                    <div className="relative space-y-12 pl-4 md:pl-0">
                        {/* Cinematic Gradient Line */}
                        <div className="absolute left-[35px] md:left-[50%] top-8 bottom-8 w-1 transform md:-translate-x-1/2 z-0 hidden md:block">
                            <div className="w-full h-full bg-gradient-to-b from-brand-accent-orange via-brand-accent-blue to-red-500 rounded-full opacity-30"></div>
                        </div>
                        {/* Mobile line */}
                        <div className="absolute left-[35px] top-8 bottom-8 w-1 bg-gradient-to-b from-brand-accent-orange via-brand-accent-blue to-red-500 rounded-full opacity-30 md:hidden block z-0"></div>

                        {/* Item 1: The Invisible Work Paradox */}
                        <div className="relative grid md:grid-cols-2 gap-8 md:gap-24 items-center">
                            <div className="hidden md:block text-right">
                                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-brand-dark/5 shadow-xl shadow-brand-dark/5 hover:shadow-2xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
                                    <h3 className="text-2xl font-bold font-heading text-brand-dark mb-3">
                                        The Invisible Work Paradox
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Your team tackles complex backend logic. The UI remains
                                        unchanged. The client sees zero progress. You bill 40 hours;
                                        they question every minute.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-brand-light border-4 border-white shadow-xl z-10">
                                <div className="w-10 h-10 rounded-full bg-brand-accent-orange/10 flex items-center justify-center text-brand-accent-orange font-black text-xl">
                                    ?
                                </div>
                            </div>
                            <div className="pl-20 md:hidden">
                                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-brand-dark/5 shadow-lg">
                                    <h3 className="text-2xl font-bold font-heading text-brand-dark mb-2">
                                        The Invisible Work Paradox
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        Your team tackles complex backend logic. The UI remains
                                        unchanged. The client sees zero progress.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Item 2: The Context Switch Tax */}
                        <div className="relative grid md:grid-cols-2 gap-8 md:gap-24 items-center">
                            <div className="md:col-start-2 hidden md:block">
                                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-brand-dark/5 shadow-xl shadow-brand-dark/5 hover:shadow-2xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
                                    <h3 className="text-2xl font-bold font-heading text-brand-dark mb-3">
                                        The Context Switch Tax
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Manual reporting kills momentum. Every "Is this done?"
                                        message breaks flow. You are paying your most expensive
                                        resources to act as secretaries.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-brand-light border-4 border-white shadow-xl z-10">
                                <div className="w-10 h-10 rounded-full bg-brand-accent-blue/10 flex items-center justify-center text-brand-accent-blue font-bold text-sm">
                                    {`</>`}
                                </div>
                            </div>
                            <div className="pl-20 md:hidden">
                                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-brand-dark/5 shadow-lg">
                                    <h3 className="text-2xl font-bold font-heading text-brand-dark mb-2">
                                        The Context Switch Tax
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        Manual reporting kills momentum. Every "Is this done?"
                                        message breaks flow.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Item 3: The Evidence Gap */}
                        <div className="relative grid md:grid-cols-2 gap-8 md:gap-24 items-center">
                            <div className="hidden md:block text-right">
                                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-brand-dark/5 shadow-xl shadow-brand-dark/5 hover:shadow-2xl hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1">
                                    <h3 className="text-2xl font-bold font-heading text-brand-dark mb-3">
                                        The Evidence Gap
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Invoices are claims; logs are proof. Without a direct link
                                        between cash and commits, you are stuck excavating Jira
                                        tickets to justify your fees.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-brand-light border-4 border-white shadow-xl z-10">
                                <div className="w-10 h-10 rounded-full bg-brand-dark/5 flex items-center justify-center text-brand-dark/50">
                                    <Zap className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="pl-20 md:hidden">
                                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-brand-dark/5 shadow-lg">
                                    <h3 className="text-2xl font-bold font-heading text-brand-dark mb-2">
                                        The Evidence Gap
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        Invoices are claims; logs are proof. You are stuck
                                        excavating Jira tickets to justify your fees.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Item 4: Margin Leakage (Alert) */}
                        <div className="relative flex items-center justify-center pt-8">
                            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center w-20 h-20 rounded-full bg-red-500 border-8 border-brand-light z-10 shadow-2xl animate-pulse">
                                <span className="text-white font-black text-3xl">!</span>
                            </div>
                            <div className="pl-24 md:pl-0 pt-4 md:pt-[6rem] text-left md:text-center w-full">
                                <div className="inline-block px-6 py-2 bg-red-50 text-red-600 rounded-full border border-red-100 shadow-sm">
                                    <h3 className="text-xl md:text-2xl font-black font-heading uppercase tracking-widest italic">
                                        MARGIN LEAKAGE
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Proof Packet Visual Section */}
            <section className="py-24 px-6 bg-brand-light relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent-blue/5 rounded-full blur-[120px]" />

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent-green/10 text-sm font-bold text-brand-accent-green border border-brand-accent-green/20">
                            <ShieldCheck className="h-4 w-4" />
                            The Solution
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-dark leading-tight">
                            Don't just invoice. <br />
                            <span className="text-brand-accent-blue">Send a Proof Packet.</span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-light">
                            ShipDocket automatically generates a cryptographically signed "Bill of
                            Lading" for your code. It proves exactly what was delivered, linked to
                            the Git commit and Jira ticket.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Eliminates 'what did you do?' questions",
                                "Auto-generated from your existing tools",
                                "Verifiable hash-chain for security",
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-3 text-brand-dark font-medium"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-brand-accent-green flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* The Visual Card */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent-blue/20 to-brand-accent-purple/20 rounded-[2.5rem] blur-2xl opacity-70" />
                        <div className="bg-white rounded-3xl shadow-2xl border border-brand-gray-light p-8 relative transform hover:scale-[1.02] transition-transform duration-500">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-brand-gray-light">
                                <div>
                                    <div className="text-[10px] font-mono font-bold text-brand-gray-mid uppercase tracking-widest mb-1">
                                        Immutable Ledger Record #402
                                    </div>
                                    <h3 className="text-2xl font-black font-heading text-brand-dark uppercase">
                                        Delivery Verified
                                    </h3>
                                    <p className="text-muted-foreground font-serif italic text-lg mt-1">
                                        Scope: User Auth Refactor
                                    </p>
                                </div>
                                <ShieldCheck className="h-5 w-5 text-brand-dark/30" />
                            </div>

                            {/* Badge */}
                            <div className="bg-brand-light rounded-lg py-2 px-4 flex items-center gap-2 w-fit mb-8 border border-brand-dark/5">
                                <CheckCircle2 className="h-4 w-4 text-brand-dark" />
                                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                                    Cryptographically Signed
                                </span>
                            </div>

                            {/* Timeline Details */}
                            <div className="space-y-6 mb-8">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                        Manifested
                                    </p>
                                    <p className="text-brand-dark font-bold">
                                        <Typewriter
                                            text="Jan 10 • Jira #202"
                                            delay={200}
                                            speed={25}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                        Cargo
                                    </p>
                                    <p className="text-brand-dark font-bold">
                                        <Typewriter
                                            text="12 Commits, 2 PRs, CI Passed"
                                            delay={500}
                                            speed={22}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                        Authorized
                                    </p>
                                    <p className="text-brand-dark font-bold">
                                        <Typewriter
                                            text="Jan 12 • Auto-closed"
                                            delay={900}
                                            speed={25}
                                        />
                                    </p>
                                </div>
                            </div>

                            {/* Verification List */}
                            <div className="space-y-3 mb-8">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                                    Evidence Summary
                                </p>
                                <div className="space-y-2">
                                    {[
                                        { text: "PR #847 merged with 2 approvals", delay: 1300 },
                                        { text: "All CI checks passed", delay: 1600 },
                                        { text: "Code review completed", delay: 1850 },
                                        { text: "Hash chain verified", delay: 2100 },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-brand-accent-green shadow-sm shadow-green-200" />
                                            <span className="text-xs font-medium text-muted-foreground">
                                                <Typewriter
                                                    text={item.text}
                                                    delay={item.delay}
                                                    speed={25}
                                                />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-end pt-4 border-t border-brand-gray-light border-dashed">
                                <div className="font-mono text-[10px] text-muted-foreground">
                                    Hash: a7f3e9c2...
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark">
                                    Ready for Invoicing
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
