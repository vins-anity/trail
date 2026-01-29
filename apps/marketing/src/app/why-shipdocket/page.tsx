import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Database,
    Lock,
    ShieldCheck,
    TrendingUp,
    Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function WhyPage() {
    return (
        <div className="bg-brand-light min-h-screen py-24 px-6 font-sans">
            <div className="max-w-6xl mx-auto text-center">
                {/* Header */}
                <div className="mb-20 space-y-6">
                    <Badge className="bg-brand-dark text-brand-light hover:bg-brand-accent-blue px-6 py-2 rounded-full text-sm tracking-wider">
                        BUSINESS IMPACT
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight text-brand-dark leading-[1.1]">
                        The ROI of Trust
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                        ShipDocket isn't just a status update tool. It's a revenue acceleration
                        platform for modern software agencies.
                    </p>
                </div>

                {/* ROI Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {/* Card 1 */}
                    <div className="relative group p-8 rounded-[2rem] border border-brand-dark/5 bg-white/60 backdrop-blur-md shadow-xl shadow-brand-dark/5 hover:shadow-2xl hover:bg-white/90 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 bg-brand-accent-green pointer-events-none -translate-y-1/2 translate-x-1/2" />
                        <span className="text-6xl font-black text-brand-dark block mb-4 tracking-tighter">
                            30%
                        </span>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-brand-accent-orange" />
                            <p className="font-heading font-bold text-lg text-brand-dark">
                                Faster Approvals
                            </p>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                            When clients have a verified Proof Packet attached to the invoice, they
                            pay without hesitation.
                        </p>
                        <div className="bg-brand-light/50 p-3 rounded-lg border border-brand-dark/5 text-xs text-left">
                            <div className="flex justify-between mb-1 opacity-60">
                                <span>Industry Avg:</span>
                                <span className="line-through decoration-brand-accent-orange/50">
                                    14 Days
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-brand-dark">
                                <span>ShipDocket:</span>
                                <span className="text-brand-accent-green">2 Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative group p-8 rounded-[2rem] border border-brand-dark/5 bg-white/60 backdrop-blur-md shadow-xl shadow-brand-dark/5 hover:shadow-2xl hover:bg-white/90 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 bg-brand-accent-blue pointer-events-none -translate-y-1/2 translate-x-1/2" />
                        <span className="text-6xl font-black text-brand-dark block mb-4 tracking-tighter">
                            Zero
                        </span>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <ShieldCheck className="w-5 h-5 text-brand-accent-blue" />
                            <p className="font-heading font-bold text-lg text-brand-dark">
                                Billing Disputes
                            </p>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                            Eliminate "did you really work on this?" conversations forever with
                            cryptographic proof of delivery.
                        </p>
                        <div className="bg-brand-light/50 p-3 rounded-lg border border-brand-dark/5 text-xs text-left">
                            <div className="flex justify-between mb-1 opacity-60">
                                <span>Typical Friction:</span>
                                <span>High Trust Tax</span>
                            </div>
                            <div className="flex justify-between font-bold text-brand-dark">
                                <span>ShipDocket:</span>
                                <span className="text-brand-accent-blue">Irrefutable Proof</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative group p-8 rounded-[2rem] border border-brand-dark/5 bg-white/60 backdrop-blur-md shadow-xl shadow-brand-dark/5 hover:shadow-2xl hover:bg-white/90 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 bg-brand-accent-purple pointer-events-none -translate-y-1/2 translate-x-1/2" />
                        <span className="text-6xl font-black text-brand-dark block mb-4 tracking-tighter">
                            90%
                        </span>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-brand-accent-purple" />
                            <p className="font-heading font-bold text-lg text-brand-dark">
                                Less Admin Time
                            </p>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                            Automated collection of evidence means your PMs can focus on delivery,
                            not chasing devs for updates.
                        </p>
                        <div className="bg-brand-light/50 p-3 rounded-lg border border-brand-dark/5 text-xs text-left">
                            <div className="flex justify-between mb-1 opacity-60">
                                <span>Manual Reporting:</span>
                                <span className="line-through decoration-brand-accent-orange/50">
                                    4 Hrs/Week
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-brand-dark">
                                <span>ShipDocket:</span>
                                <span className="text-brand-accent-purple">Automated</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section - Enterprise Grade */}
                <div className="bg-brand-dark text-brand-light p-12 rounded-[2.5rem] border border-brand-dark relative overflow-hidden text-left md:flex gap-16 items-center shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div className="flex-1 space-y-6 relative z-10">
                        <div>
                            <Badge className="bg-brand-accent-green text-brand-dark hover:bg-brand-accent-green px-4 py-1 rounded-full text-xs font-bold tracking-wider mb-4 border-none">
                                SOC2 TYPE 2 READY
                            </Badge>
                            <h2 className="text-4xl font-heading font-black mb-6">
                                Enterprise-Grade Security
                            </h2>
                        </div>

                        <p className="text-lg text-brand-light/80 leading-relaxed mb-4">
                            We know that for agencies, your code is your currency. Our architecture
                            ensures your IP never leaves your control.
                        </p>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-brand-accent-green shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-lg font-bold">
                                        Metadata Only
                                    </strong>
                                    <span className="text-brand-light/70 text-sm">
                                        We never clone or read your source code.
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-brand-accent-green shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-lg font-bold">
                                        Supabase Enterprise
                                    </strong>
                                    <span className="text-brand-light/70 text-sm">
                                        Built on AWS-hosted, SOC2 Type 2 & HIPAA compliant
                                        infrastructure.
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-brand-accent-green shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-lg font-bold">
                                        Tamper-Evident Ledger
                                    </strong>
                                    <span className="text-brand-light/70 text-sm">
                                        All events are hash-chained. History cannot be rewritten
                                        without detection.
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Visual Badges */}
                    <div className="flex-shrink-0 mt-12 md:mt-0 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 flex flex-col gap-6 w-full md:w-72 items-center justify-center">
                            <div className="flex items-center gap-4 w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <Database className="w-8 h-8 text-brand-accent-green" />
                                <div className="text-left">
                                    <div className="text-xs font-bold text-brand-light/50 uppercase tracking-widest">
                                        Infrastructure
                                    </div>
                                    <div className="font-bold text-brand-light">Supabase</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <ShieldCheck className="w-8 h-8 text-brand-accent-blue" />
                                <div className="text-left">
                                    <div className="text-xs font-bold text-brand-light/50 uppercase tracking-widest">
                                        Compliance
                                    </div>
                                    <div className="font-bold text-brand-light">SOC2 Type 2</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <Lock className="w-8 h-8 text-brand-accent-purple" />
                                <div className="text-left">
                                    <div className="text-xs font-bold text-brand-light/50 uppercase tracking-widest">
                                        Encryption
                                    </div>
                                    <div className="font-bold text-brand-light">AES-256</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
