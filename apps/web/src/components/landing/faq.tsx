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
        <section id="faq" className="relative py-32 overflow-hidden bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center space-y-6 mb-20">
                    <h2 className="text-4xl md:text-5xl font-black font-heading text-brand-dark tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-brand-gray-mid font-serif">
                        Everything you need to know about ShipDocket.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div
                            key={faq.q}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                expandedFaq === idx
                                    ? "bg-brand-light border-brand-dark shadow-md"
                                    : "bg-white border-brand-gray-light hover:border-brand-gray-mid"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                            >
                                <h3
                                    className={`font-bold text-lg font-heading ${expandedFaq === idx ? "text-brand-dark" : "text-brand-gray-mid"}`}
                                >
                                    {faq.q}
                                </h3>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        expandedFaq === idx
                                            ? "bg-brand-dark text-brand-light rotate-180"
                                            : "bg-brand-light text-brand-gray-mid"
                                    }`}
                                >
                                    <ChevronDownIcon className="w-5 h-5" />
                                </div>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    expandedFaq === idx
                                        ? "max-h-40 opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                <div className="px-8 pb-8 text-brand-dark/80 leading-relaxed text-lg">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="text-center pt-12 text-brand-gray-mid">
                        <p>
                            Have more questions? Check out our{" "}
                            <a
                                href="/security-faq"
                                className="text-brand-dark font-bold hover:text-brand-accent-blue hover:underline transition-colors"
                            >
                                Security FAQ
                            </a>{" "}
                            or{" "}
                            <a
                                href="mailto:support@shipdocket.com"
                                className="text-brand-dark font-bold hover:text-brand-accent-blue hover:underline transition-colors"
                            >
                                Contact Support
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
