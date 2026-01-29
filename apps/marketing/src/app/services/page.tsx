"use client";

import {
    CheckCircle2,
    Clock,
    FileSignature,
    FileText,
    GitCommit,
    Globe,
    LayoutTemplate,
    Lock,
    Package,
    SearchCheck,
    ShieldCheck,
    Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState<"how-it-works" | "what-we-offer">("how-it-works");

    return (
        <div className="bg-brand-light min-h-screen py-24 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <Badge className="bg-brand-dark text-brand-light hover:bg-brand-accent-blue px-6 py-2 rounded-full text-sm tracking-wider">
                        OUR PLATFORM
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight text-brand-dark leading-[1.1]">
                        The Delivery Supply Chain
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif italic">
                        From commitment to cash in 4 automated stages.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-20">
                    <div className="inline-flex bg-white p-1.5 rounded-full border border-brand-gray-light shadow-sm">
                        <button
                            onClick={() => setActiveTab("how-it-works")}
                            className={cn(
                                "px-8 py-3 rounded-full text-sm font-bold transition-all duration-300",
                                activeTab === "how-it-works"
                                    ? "bg-brand-dark text-brand-light shadow-md"
                                    : "text-muted-foreground hover:text-brand-dark",
                            )}
                        >
                            How it Works
                        </button>
                        <button
                            onClick={() => setActiveTab("what-we-offer")}
                            className={cn(
                                "px-8 py-3 rounded-full text-sm font-bold transition-all duration-300",
                                activeTab === "what-we-offer"
                                    ? "bg-brand-dark text-brand-light shadow-md"
                                    : "text-muted-foreground hover:text-brand-dark",
                            )}
                        >
                            What We Offer
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[600px] animate-fade-in-up">
                    {activeTab === "how-it-works" ? <HowItWorksSection /> : <WhatWeOfferSection />}
                </div>
            </div>
        </div>
    );
}

function HowItWorksSection() {
    return (
        <div className="space-y-32 relative">
            {/* Stage 1: The Manifest */}
            <div className="md:grid md:grid-cols-2 gap-16 items-center group relative">
                <div className="space-y-6 order-2 md:order-1 text-right md:pr-8">
                    <div className="inline-flex items-center gap-2 mb-2 md:flex-row-reverse">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white font-bold text-sm">
                            1
                        </span>
                        <h2 className="text-3xl font-heading font-bold text-brand-dark">
                            The Manifest
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        When a developer moves a ticket to "In Progress" in Jira, ShipDocket
                        'manifests' the item. It’s now on the official record. No new tools, no
                        manual start buttons.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-brand-gray-light inline-block text-left shadow-sm">
                        <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                            Key Benefit: Formalizes intent instantly.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                                <span>Prevents misaligned expectations</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                                <span>Creates first audit entry</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <div className="bg-white p-6 rounded-3xl border border-brand-gray-light shadow-2xl shadow-brand-gray-light/50 transform group-hover:scale-[1.02] transition-transform duration-500">
                        <div className="font-mono text-xs text-muted-foreground space-y-3">
                            <p className="text-brand-dark font-bold">Slack #dev-updates</p>
                            <div className="pl-3 border-l-2 border-brand-gray-light">
                                <p>"John, can you fix login timeout?"</p>
                                <p className="text-brand-accent-green font-bold mt-1">
                                    ✓ John accepted task
                                </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60">
                                2026-01-10 14:30 UTC
                            </p>
                        </div>
                    </div>
                </div>

                {/* Connector 1 to 2 */}
                <div className="hidden md:block absolute left-1/2 bottom-[-8rem] transform -translate-x-1/2 w-[600px] h-32 pointer-events-none z-0 opacity-40">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 600 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M150 0 C150 60, 450 60, 450 120"
                            stroke="url(#gradient1-2)"
                            strokeWidth="3"
                            strokeDasharray="8 8"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient
                                id="gradient1-2"
                                x1="150"
                                y1="0"
                                x2="450"
                                y2="120"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#141413" />
                                <stop offset="1" stopColor="#141413" stopOpacity="0.5" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Stage 2: The Cargo */}
            <div className="md:grid md:grid-cols-2 gap-16 items-center group relative">
                <div className="order-1">
                    <div className="bg-white p-6 rounded-3xl border border-brand-gray-light shadow-2xl shadow-brand-gray-light/50 transform group-hover:scale-[1.02] transition-transform duration-500">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-brand-light rounded-lg border border-brand-gray-light/50">
                                <span className="text-xs font-bold text-brand-dark flex items-center gap-2">
                                    <GitCommit className="w-4 h-4 text-brand-accent-blue" />
                                    PR #123 merged
                                </span>
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-brand-light rounded-lg border border-brand-gray-light/50">
                                <span className="text-xs font-bold text-brand-dark flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-brand-accent-orange" />1
                                    approval received
                                </span>
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-brand-light rounded-lg border border-brand-gray-light/50">
                                <span className="text-xs font-bold text-brand-dark flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-brand-accent-purple" />
                                    CI checks passed
                                </span>
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6 order-2 pl-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white font-bold text-sm">
                            2
                        </span>
                        <h2 className="text-3xl font-heading font-bold text-brand-dark">
                            The Cargo
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        We attach the digital cargo: GitHub PRs, CI test results, and approvals.
                        Every event is hash-chained to ensure it can't be faked.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-brand-gray-light inline-block text-left shadow-sm">
                        <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                            Key Benefit: Indisputable proof of execution.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                                <span>PR merged + reviewed + tested</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                                <span>All metadata timestamped</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Connector 2 to 3 */}
                <div className="hidden md:block absolute left-1/2 bottom-[-8rem] transform -translate-x-1/2 w-[600px] h-32 pointer-events-none z-0 opacity-40">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 600 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M450 0 C450 60, 150 60, 150 120"
                            stroke="url(#gradient2-3)"
                            strokeWidth="3"
                            strokeDasharray="8 8"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient
                                id="gradient2-3"
                                x1="450"
                                y1="0"
                                x2="150"
                                y2="120"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#141413" />
                                <stop offset="1" stopColor="#141413" stopOpacity="0.5" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Stage 3: The Inspection */}
            <div className="md:grid md:grid-cols-2 gap-16 items-center group relative">
                <div className="space-y-6 order-2 md:order-1 text-right md:pr-8">
                    <div className="inline-flex items-center gap-2 mb-2 md:flex-row-reverse">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white font-bold text-sm">
                            3
                        </span>
                        <h2 className="text-3xl font-heading font-bold text-brand-dark">
                            The Inspection
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        If tests pass and code is reviewed, ShipDocket proposes closure. It
                        auto-closes in 24h unless you veto. Speed with control.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-brand-gray-light inline-block text-left shadow-sm">
                        <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                            Key Benefit: Removes management bottleneck.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                                <span>Auto-close timer (e.g. 24h)</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                                <span>Manager veto stops closure</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <div className="bg-white p-8 rounded-3xl border border-brand-gray-light shadow-2xl shadow-brand-gray-light/50 transform group-hover:scale-[1.02] transition-transform duration-500">
                        <p className="text-xs font-bold text-brand-gray-mid uppercase tracking-widest mb-4">
                            Lead Approval Gate
                        </p>
                        <p className="font-heading font-bold text-brand-dark text-lg mb-6">
                            Auto-closing in 23h 45m...
                        </p>
                        <div className="flex gap-3">
                            <button className="flex-1 bg-brand-dark text-brand-light py-2 px-4 rounded-lg font-bold text-sm hover:bg-black transition-colors">
                                Approve Now
                            </button>
                            <button className="flex-1 bg-transparent border border-brand-gray-mid/30 text-brand-dark py-2 px-4 rounded-lg font-bold text-sm hover:bg-brand-light transition-colors">
                                Veto & Explain
                            </button>
                        </div>
                    </div>
                </div>

                {/* Connector 3 to 4 */}
                <div className="hidden md:block absolute left-1/2 bottom-[-8rem] transform -translate-x-1/2 w-[600px] h-32 pointer-events-none z-0 opacity-40">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 600 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M150 0 C150 60, 450 60, 450 120"
                            stroke="url(#gradient3-4)"
                            strokeWidth="3"
                            strokeDasharray="8 8"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient
                                id="gradient3-4"
                                x1="150"
                                y1="0"
                                x2="450"
                                y2="120"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#141413" />
                                <stop offset="1" stopColor="#141413" stopOpacity="0.5" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Stage 4: The Proof Packet */}
            <div className="md:grid md:grid-cols-2 gap-16 items-center group relative">
                <div className="order-1">
                    <div className="bg-white p-6 rounded-3xl border border-brand-gray-light shadow-2xl shadow-brand-gray-light/50 transform group-hover:scale-[1.02] transition-transform duration-500">
                        <div className="font-mono text-xs bg-brand-light p-4 rounded-xl border border-brand-gray-light/50">
                            <div className="flex justify-between text-muted-foreground mb-4">
                                <span>PP-PROJ-101</span>
                                <span>HASH: a7f3...</span>
                            </div>
                            <p className="font-bold text-brand-dark text-sm mb-2">
                                Fix login timeout
                            </p>
                            <p className="italic text-muted-foreground mb-4">
                                "Resolved session expiry issue ensuring users stay logged in..."
                            </p>
                            <div className="text-[10px] text-right text-muted-foreground">
                                Jan 11, 2026 • Verified
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6 order-2 pl-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark text-white font-bold text-sm">
                            4
                        </span>
                        <h2 className="text-3xl font-heading font-bold text-brand-dark">
                            The Proof Packet
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        A client-ready link generated automatically. AI summarizes technical logs
                        into business value language your client understands.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-brand-gray-light inline-block text-left shadow-sm">
                        <p className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                            Key Benefit: Attach to invoice → Get paid.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                                <span>Web, PDF, JSON export</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent-green" />
                                <span>Hash-chain integrity verification</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WhatWeOfferSection() {
    const features = [
        {
            icon: <GitCommit className="w-6 h-6 text-brand-accent-orange" />,
            title: "Zero-Touch Ingestion",
            description:
                "We hook directly into GitHub and Jira. No manual data entry. Your developers keep coding, we keep tracking.",
            bgClass: "bg-brand-accent-orange/10",
        },
        {
            icon: <Globe className="w-6 h-6 text-brand-accent-blue" />,
            title: "Client Portal",
            description:
                "Give clients a white-labeled dashboard to view their Proof Packets in real-time. Build trust through transparency.",
            bgClass: "bg-brand-accent-blue/10",
        },
        {
            icon: <Lock className="w-6 h-6 text-brand-accent-green" />,
            title: "Tamper-Proof Audit",
            description:
                "Every action is cryptographically hash-chained. Once verified, history cannot be rewritten.",
            bgClass: "bg-brand-accent-green/10",
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-brand-accent-purple" />,
            title: "SOC2 Compliance Ready",
            description:
                "Our logs and verification trails are structured to satisfy widespread compliance controls automatically.",
            bgClass: "bg-brand-accent-purple/10",
        },
        {
            icon: <LayoutTemplate className="w-6 h-6 text-brand-dark" />,
            title: "Brand Customization",
            description:
                "Your invoices, your brand. Customize the Proof Packet with your logo, colors, and domain.",
            bgClass: "bg-brand-dark/10",
        },
        {
            icon: <Clock className="w-6 h-6 text-brand-accent-orange" />,
            title: "SLA Monitoring",
            description:
                "Track delivery times against your service level agreements. Get alerted before you breach a contract.",
            bgClass: "bg-brand-accent-orange/10",
        },
    ];

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
                <div
                    key={i}
                    className="relative group p-8 rounded-[2rem] border border-brand-dark/5 bg-white/60 backdrop-blur-md shadow-xl shadow-brand-dark/5 hover:shadow-2xl hover:bg-white/90 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                    {/* Gradient Blob for fun */}
                    <div
                        className={cn(
                            "absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none -translate-y-1/2 translate-x-1/2",
                            feature.bgClass.replace("/10", "/30"),
                        )}
                    />

                    <div
                        className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-dark/5",
                            feature.bgClass,
                        )}
                    >
                        {feature.icon}
                    </div>

                    <h3 className="text-xl font-heading font-black text-brand-dark mb-3 tracking-tight">
                        {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                        {feature.description}
                    </p>

                    {/* Subtle Corner Accent */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-brand-dark">
                        <Zap className="w-6 h-6" />
                    </div>
                </div>
            ))}
        </div>
    );
}
