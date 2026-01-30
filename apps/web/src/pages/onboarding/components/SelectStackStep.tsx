import {
    IconBrandAsana,
    IconBrandBitbucket,
    IconBrandGithub,
    IconBrandGitlab,
    IconBrandSlack,
    IconBrandTeams,
    IconBrandTrello,
    IconBrandVscode,
    IconCheckbox,
} from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectStackStepProps {
    onNext: (stack: string[]) => void;
    onBack: () => void;
    teamType: string;
}

const TOOLS = [
    {
        category: "Project Management",
        items: [
            { id: "jira", name: "Jira", icon: IconCheckbox, enabled: true },
            { id: "trello", name: "Trello", icon: IconBrandTrello, enabled: false },
            { id: "asana", name: "Asana", icon: IconBrandAsana, enabled: false },
        ],
    },
    {
        category: "Source Code",
        items: [
            { id: "github", name: "GitHub", icon: IconBrandGithub, enabled: true },
            { id: "gitlab", name: "GitLab", icon: IconBrandGitlab, enabled: false },
            { id: "bitbucket", name: "Bitbucket", icon: IconBrandBitbucket, enabled: false },
        ],
    },
    {
        category: "Communication",
        items: [
            { id: "slack", name: "Slack", icon: IconBrandSlack, enabled: true },
            { id: "teams", name: "Teams", icon: IconBrandTeams, enabled: false },
            { id: "discord", name: "Discord", icon: IconBrandVscode, enabled: false }, // Placeholder icon
        ],
    },
];

export function SelectStackStep({ onNext, onBack, teamType }: SelectStackStepProps) {
    const [selected, setSelected] = useState<string[]>(["jira", "github", "slack"]);

    const toggle = (id: string, enabled: boolean) => {
        if (!enabled) return;
        if (selected.includes(id)) {
            setSelected(selected.filter((i) => i !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const getRecommendation = () => {
        if (teamType === "dev_shop") return "Recommended for fast deployment cycles.";
        if (teamType === "agency") return "Recommended for client visibility.";
        return "Standard stack for modern product teams.";
    };

    return (
        <div className="max-w-4xl mx-auto px-6 animate-fade-in-up">
            <div className="text-center mb-8 space-y-2">
                <h2 className="text-3xl font-black font-heading text-brand-dark">
                    Select Your Stack
                </h2>
                <p className="text-brand-gray-mid">
                    What tools power your {teamType === "agency" ? "agency" : "team"}? {getRecommendation()}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {TOOLS.map((category) => (
                    <div key={category.category} className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gray-mid/80 font-heading">
                            {category.category}
                        </h3>
                        <div className="space-y-3">
                            {category.items.map((tool) => {
                                const isSelected = selected.includes(tool.id);
                                return (
                                    <div
                                        key={tool.id}
                                        onClick={() => toggle(tool.id, tool.enabled)}
                                        className={cn(
                                            "relative p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 cursor-pointer select-none",
                                            !tool.enabled && "opacity-60 grayscale cursor-not-allowed bg-gray-50",
                                            isSelected && tool.enabled
                                                ? "bg-brand-light border-brand-accent-blue shadow-md ring-1 ring-brand-accent-blue"
                                                : "bg-white border-brand-gray-light hover:border-brand-accent-blue/50",
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                isSelected && tool.enabled
                                                    ? "bg-brand-accent-blue text-white"
                                                    : "bg-brand-gray-light/20 text-brand-gray-mid",
                                            )}
                                        >
                                            <tool.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-brand-dark">{tool.name}</div>
                                            {!tool.enabled && (
                                                <div className="text-[10px] uppercase font-bold text-brand-accent-orange bg-brand-accent-orange/10 inline-block px-1.5 py-0.5 rounded mt-0.5">
                                                    Coming Soon
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && tool.enabled && (
                                            <div className="w-5 h-5 rounded-full bg-brand-accent-blue flex items-center justify-center">
                                                <svg
                                                    className="w-3.5 h-3.5 text-white"
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
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
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
                    disabled={selected.length === 0}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
