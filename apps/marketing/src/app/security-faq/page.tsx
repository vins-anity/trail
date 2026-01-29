"use client";

import { Bug, Database, Eye, FileKey, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function SecurityFaqPage() {
    const [openItem, setOpenItem] = useState<string | null>("source-code");

    return (
        <div className="bg-brand-light min-h-screen py-24 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Intro Section */}
                <div className="text-center mb-16 space-y-6">
                    <Badge className="bg-brand-dark text-brand-light hover:bg-brand-accent-blue px-6 py-2 rounded-full text-sm tracking-wider">
                        TRUST CENTER
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 tracking-tight text-brand-dark leading-[1.1]">
                        Security by Design
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        We built ShipDocket to be verifiable, not just secure.{" "}
                        <br className="hidden md:block" />
                        Our architecture ensures we never see your source code, only the proof of
                        its delivery.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-6 animate-fade-in-up">
                    <Accordion>
                        <AccordionItem
                            value="source-code"
                            title="Do you read or clone our source code?"
                            isOpen={openItem === "source-code"}
                            onToggle={() =>
                                setOpenItem(openItem === "source-code" ? null : "source-code")
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-brand-accent-green/10 rounded-xl border border-brand-accent-green/20">
                                    <ShieldCheck className="w-6 h-6 text-brand-accent-green shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-brand-dark mb-1">
                                            Short Answer: No.
                                        </p>
                                        <p className="text-sm text-brand-dark/80">
                                            We are a metadata-only platform.
                                        </p>
                                    </div>
                                </div>
                                <p>
                                    We integrate via the GitHub API to read{" "}
                                    <strong>metadata only</strong>: PR titles, branch names, commit
                                    hashes, timestamps, and author attribution. We explicitly do not
                                    request scopes that allow us to `git clone` your private
                                    repositories or read file blobs. Your Intellectual Property (IP)
                                    never leaves your infrastructure.
                                </p>
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            value="data-storage"
                            title="Where is data stored and how is it compliant?"
                            isOpen={openItem === "data-storage"}
                            onToggle={() =>
                                setOpenItem(openItem === "data-storage" ? null : "data-storage")
                            }
                        >
                            <div className="space-y-4">
                                <p>
                                    All customer metadata is stored in{" "}
                                    <strong>US-East (N. Virginia)</strong> on Supabase Enterprise
                                    Cloud.
                                </p>
                                <p className="text-sm text-muted-foreground/80 bg-brand-light p-3 rounded-lg border border-brand-gray-light italic">
                                    Supabase is a widely trusted, SOC2 Type 2 and HIPAA compliant
                                    database provider used by thousands of enterprises.
                                </p>
                                <ul className="grid sm:grid-cols-2 gap-4">
                                    <li className="flex items-center gap-2 p-3 bg-white rounded-lg border border-brand-gray-light">
                                        <Database className="w-4 h-4 text-brand-accent-blue" />
                                        <span className="text-sm font-medium">
                                            SOC2 Type 2 Compliant Infrastructure
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2 p-3 bg-white rounded-lg border border-brand-gray-light">
                                        <Lock className="w-4 h-4 text-brand-accent-purple" />
                                        <span className="text-sm font-medium">
                                            Daily Encrypted Backups
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            value="encryption"
                            title="How is data encrypted?"
                            isOpen={openItem === "encryption"}
                            onToggle={() =>
                                setOpenItem(openItem === "encryption" ? null : "encryption")
                            }
                        >
                            <p className="mb-4">
                                We employ a defense-in-depth encryption strategy:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>In Transit:</strong> All data is transmitted via TLS
                                    1.3. We force HTTPS for all connections and employ HSTS.
                                </li>
                                <li>
                                    <strong>At Rest:</strong> Database volumes are encrypted using
                                    AES-256.
                                </li>
                                <li>
                                    <strong>Application Level:</strong> Sensitive tokens (like OAuth
                                    refresh tokens) are encrypted at the application layer before
                                    being written to the database using a separate key management
                                    service.
                                </li>
                            </ul>
                        </AccordionItem>

                        <AccordionItem
                            value="access-control"
                            title="How do you manage tenant isolation?"
                            isOpen={openItem === "access-control"}
                            onToggle={() =>
                                setOpenItem(openItem === "access-control" ? null : "access-control")
                            }
                        >
                            <div className="flex items-start gap-4">
                                <FileKey className="w-12 h-12 text-brand-accent-orange bg-brand-accent-orange/10 p-2 rounded-lg" />
                                <div>
                                    <p className="mb-2">
                                        We use Postgres <strong>Row Level Security (RLS)</strong>{" "}
                                        enforced at the database kernel level.
                                    </p>
                                    <p>
                                        Every query requires a valid JWT with a scoped
                                        `workspace_id`. It is mathematically impossible for a query
                                        from Workspace A to return rows belonging to Workspace B,
                                        even if the application logic were to fail.
                                    </p>
                                </div>
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            value="bug-bounty"
                            title="Do you have a Bug Bounty program?"
                            isOpen={openItem === "bug-bounty"}
                            onToggle={() =>
                                setOpenItem(openItem === "bug-bounty" ? null : "bug-bounty")
                            }
                        >
                            <div
                                className="flex justify-between items-center group cursor-pointer"
                                onClick={() => window.open("mailto:security@shipdocket.com")}
                            >
                                <div>
                                    <p className="mb-2">
                                        We do not have a public program at this time, but we welcome
                                        responsible disclosure.
                                    </p>
                                    <p className="font-bold text-brand-dark underline decoration-brand-accent-blue/30 underline-offset-4 group-hover:decoration-brand-accent-blue transition-all">
                                        Contact security@shipdocket.com
                                    </p>
                                </div>
                                <Bug className="w-8 h-8 text-muted-foreground/30 group-hover:text-brand-accent-blue transition-colors" />
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            value="employee-access"
                            title="Who at ShipDocket can see my data?"
                            isOpen={openItem === "employee-access"}
                            onToggle={() =>
                                setOpenItem(
                                    openItem === "employee-access" ? null : "employee-access",
                                )
                            }
                        >
                            <p>
                                Access to production data is restricted to{" "}
                                <strong className="text-brand-dark">2 Engineering Leads</strong> and
                                requires Multi-Factor Authentication (MFA) and a VPN connection. We
                                produce audit logs for every internal access event. Support staff do
                                not have access to customer data unless explicitly granted
                                time-bounded permission by the workspace owner.
                            </p>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center border-t border-brand-dark/5 pt-8">
                    <p className="text-sm text-muted-foreground">
                        Have a specific compliance questionnaire?{" "}
                        <a
                            href="mailto:compliance@shipdocket.com"
                            className="text-brand-dark font-bold hover:underline"
                        >
                            Email our Compliance Team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
