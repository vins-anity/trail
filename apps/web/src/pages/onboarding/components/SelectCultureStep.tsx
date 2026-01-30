import { IconBolt, IconCurrentLocation, IconInfinity } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectCultureStepProps {
    onNext: (culture: "scrum" | "kanban") => void;
    onBack: () => void;
    teamType: string;
}

export function SelectCultureStep({ onNext, onBack, teamType }: SelectCultureStepProps) {
    const [selected, setSelected] = useState<"scrum" | "kanban">("scrum");

    return (
        <div className="max-w-4xl mx-auto px-6 animate-fade-in-up">
            <div className="text-center mb-10 space-y-4">
                <h2 className="text-3xl font-black font-heading text-brand-dark">How do you ship?</h2>
                <p className="text-brand-gray-mid text-lg max-w-lg mx-auto">
                    We'll optimize your workflow status tracking based on your team's rhythm.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* SCRUM Option */}
                <div
                    onClick={() => setSelected("scrum")}
                    className={cn(
                        "relative group p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center text-center gap-6",
                        selected === "scrum"
                            ? "border-brand-accent-blue bg-brand-accent-blue/5 shadow-2xl shadow-brand-accent-blue/10"
                            : "border-brand-gray-light bg-white hover:border-brand-accent-blue/30 hover:shadow-xl hover:-translate-y-1",
                    )}
                >
                    <div
                        className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center transition-all bg-white shadow-lg",
                            selected === "scrum" ? "text-brand-accent-blue scale-110" : "text-brand-gray-mid",
                        )}
                    >
                        <IconBolt className="w-10 h-10" />
                    </div>

                    <div className="space-y-3 relative z-10">
                        <h3 className="text-2xl font-bold font-heading text-brand-dark">
                            We Run Sprints
                        </h3>
                        <p className="text-brand-gray-mid leading-relaxed">
                            Structured 2-week cycles. Clear commitments. We track velocity and burn-down.
                        </p>
                    </div>

                    <div className="w-full bg-white rounded-xl p-4 border border-brand-gray-light/50 shadow-sm mt-auto max-w-xs">
                        <div className="flex gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <div className="space-y-2 opacity-50 text-xs font-mono text-left">
                            <div className="bg-brand-gray-light/20 w-3/4 h-2 rounded" />
                            <div className="bg-brand-gray-light/20 w-1/2 h-2 rounded" />
                        </div>
                    </div>

                    {selected === "scrum" && (
                        <div className="absolute top-4 right-4 text-brand-accent-blue">
                            <div className="w-6 h-6 rounded-full bg-brand-accent-blue flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* KANBAN Option */}
                <div
                    onClick={() => setSelected("kanban")}
                    className={cn(
                        "relative group p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center text-center gap-6",
                        selected === "kanban"
                            ? "border-brand-accent-green bg-brand-accent-green/5 shadow-2xl shadow-brand-accent-green/10"
                            : "border-brand-gray-light bg-white hover:border-brand-accent-green/30 hover:shadow-xl hover:-translate-y-1",
                    )}
                >
                    <div
                        className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center transition-all bg-white shadow-lg",
                            selected === "kanban"
                                ? "text-brand-accent-green scale-110"
                                : "text-brand-gray-mid",
                        )}
                    >
                        <IconInfinity className="w-10 h-10" />
                    </div>

                    <div className="space-y-3 relative z-10">
                        <h3 className="text-2xl font-bold font-heading text-brand-dark">
                            We Flow Continuously
                        </h3>
                        <p className="text-brand-gray-mid leading-relaxed">
                            Kanban style. Pull when ready. We focus on cycle time and throughput.
                        </p>
                    </div>

                    {/* Mini Kanban Board UI */}
                    <div className="flex gap-2 w-full max-w-xs mt-auto opacity-70">
                        <div className="flex-1 bg-white border border-brand-gray-light/50 p-2 rounded-lg space-y-2">
                            <div className="h-1 w-full bg-brand-gray-light rounded" />
                            <div className="h-8 w-full bg-brand-light rounded border border-brand-gray-light/20" />
                            <div className="h-8 w-full bg-brand-light rounded border border-brand-gray-light/20" />
                        </div>
                        <div className="flex-1 bg-white border border-brand-gray-light/50 p-2 rounded-lg space-y-2">
                            <div className="h-1 w-full bg-blue-100 rounded" />
                            <div className="h-8 w-full bg-blue-50 rounded border border-blue-100" />
                        </div>
                        <div className="flex-1 bg-white border border-brand-gray-light/50 p-2 rounded-lg space-y-2">
                            <div className="h-1 w-full bg-green-100 rounded" />
                            <div className="h-8 w-full bg-green-50 rounded border border-green-100" />
                        </div>
                    </div>

                    {selected === "kanban" && (
                        <div className="absolute top-4 right-4 text-brand-accent-green">
                            <div className="w-6 h-6 rounded-full bg-brand-accent-green flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
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
                    Continue
                </Button>
            </div>
        </div>
    );
}
