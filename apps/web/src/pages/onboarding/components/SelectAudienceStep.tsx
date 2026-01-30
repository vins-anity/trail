import { IconBriefcase, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectAudienceStepProps {
    onNext: (audience: "internal" | "clients") => void;
    onBack: () => void;
}

export function SelectAudienceStep({ onNext, onBack }: SelectAudienceStepProps) {
    const [selected, setSelected] = useState<"internal" | "clients">("internal");

    return (
        <div className="max-w-4xl mx-auto px-6 animate-fade-in-up">
            <div className="text-center mb-10 space-y-4">
                <h2 className="text-3xl font-black font-heading text-brand-dark">
                    Who determines success?
                </h2>
                <p className="text-brand-gray-mid text-lg max-w-lg mx-auto">
                    We'll configure your proof packets and sharing settings based on your audience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Internal Team Option */}
                <div
                    onClick={() => setSelected("internal")}
                    className={cn(
                        "group p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col gap-6 text-left",
                        selected === "internal"
                            ? "border-brand-dark bg-brand-light/50"
                            : "border-brand-gray-light bg-white hover:border-brand-dark/30 hover:shadow-lg",
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={cn(
                                "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                                selected === "internal"
                                    ? "bg-brand-dark text-brand-light"
                                    : "bg-brand-gray-light/20 text-brand-dark",
                            )}
                        >
                            <IconUsers className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-brand-dark">
                            Internal Team
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-brand-gray-mid">
                            Optimized for speed and code quality. Proofs are kept private by default.
                            Great for engineering-led teams.
                        </p>
                        <ul className="space-y-2 text-sm text-brand-dark/80 font-medium">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Private Proof Packets
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Technical AI Summaries
                            </li>
                            <li className="flex items-center gap-2 opacity-50">
                                <span className="text-gray-400">✗</span> Client Portal Disabled
                            </li>
                        </ul>
                    </div>
                </div>

                {/* External Clients Option */}
                <div
                    onClick={() => setSelected("clients")}
                    className={cn(
                        "group p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col gap-6 text-left",
                        selected === "clients"
                            ? "border-brand-accent-blue bg-brand-accent-blue/5 shadow-xl shadow-brand-accent-blue/10"
                            : "border-brand-gray-light bg-white hover:border-brand-accent-blue/30 hover:shadow-lg",
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={cn(
                                "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                                selected === "clients"
                                    ? "bg-brand-accent-blue text-white"
                                    : "bg-brand-gray-light/20 text-brand-dark",
                            )}
                        >
                            <IconBriefcase className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-brand-dark">
                            External Clients
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-brand-gray-mid">
                            Optimized for transparency and trust. Enables sharing features for stakeholders.
                        </p>
                        <ul className="space-y-2 text-sm text-brand-dark/80 font-medium">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Shareable Verification Links
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Client-Friendly Summaries
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-brand-accent-blue">★</span> Client Portal Enabled
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-brand-gray-mid hover:text-brand-dark font-medium transition-colors"
                >
                    &larr; Back
                </button>
                <Button
                    onClick={() => onNext(selected)}
                    size="lg"
                    className="bg-brand-dark text-brand-light hover:bg-black rounded-xl px-10 shadow-lg"
                >
                    Initialize Command Center
                </Button>
            </div>
        </div>
    );
}
