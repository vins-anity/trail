import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function LandingFaq() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "Setup",
            a: "5 mins. Connect Slack/Jira/GitHub.",
        },
        {
            q: "Team",
            a: "Silent background—devs unchanged.",
        },
        {
            q: "Customization",
            a: "PDF/JSON links, branded exports.",
        },
        {
            q: "Flexibility",
            a: "Beta free. Cancel/export anytime.",
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
                        Everything you need to know about Trail AI.
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
                </div>
            </div>
        </section>
    );
}
