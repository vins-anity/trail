import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function LandingFaq() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "Does ShipDocket read my source code?",
            a: "No. We operate on a Metadata-Only basis. We verify signals like 'PR Merged' or 'Tests Passed', but we never access your repository's code content.",
        },
        {
            q: "Do I need to change my team's workflow?",
            a: "Zero changes required. Your team keeps using Jira, Slack, and GitHub exactly as they do now. We run silently in the background.",
        },
        {
            q: "What is a 'Proof Packet'?",
            a: "It's a verified, read-only web page that summarizes exactly what was delivered in a sprint, written in plain English.",
        },
        {
            q: "Can I export it?",
            a: "Yes. JSON for compliance, PDF for invoicing.",
        },
    ];

    return (
        <section id="faq" className="relative py-24 overflow-hidden border-t border-border">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center space-y-6 mb-16">
                    <h2 className="text-5xl font-bold leading-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about ShipDocket.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-border/50 rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setExpandedFaq(expandedFaq === idx ? null : idx)
                                }
                                className="w-full px-6 py-4 flex items-center justify-between bg-card/50 hover:bg-card transition-colors"
                            >
                                <h3 className="font-semibold text-left">{faq.q}</h3>
                                <ChevronDownIcon
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${expandedFaq === idx ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {expandedFaq === idx && (
                                <div className="px-6 py-4 text-muted-foreground leading-relaxed border-t border-border/30 bg-background/50">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="text-center pt-8 text-muted-foreground text-sm">
                        <p>Have more questions? Check out our <a href="/security-faq" className="text-primary hover:underline">Security FAQ</a> or <a href="mailto:support@shipdocket.com" className="text-primary hover:underline">Contact Support</a>.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
