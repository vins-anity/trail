import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================

export interface WorkflowConfig {
    startTracking: string[];
    reviewStatus: string[];
    doneStatus: string[];
    excludedTaskTypes?: string[];
    policyTier?: "agile" | "standard" | "hardened";
}

interface ReviewConfigStepProps {
    initialConfig: WorkflowConfig;
    source: "jira" | "template" | "manual";
    detectedType?: string;
    description?: string;
    onSave: (config: WorkflowConfig) => void;
    onBack: () => void;
}

// ==========================================
// Component
// ==========================================

export function ReviewConfigStep({
    initialConfig,
    source,
    detectedType,
    description,
    onSave,
    onBack,
}: ReviewConfigStepProps) {
    const [config, setConfig] = useState<WorkflowConfig>(initialConfig);
    const [newStatus, setNewStatus] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<keyof WorkflowConfig | null>(null);

    // Sync if initialConfig changes (e.g. re-analysis)
    useEffect(() => {
        setConfig(initialConfig);
    }, [initialConfig]);

    const handleRemoveStatus = (category: keyof WorkflowConfig, status: string) => {
        setConfig((prev) => ({
            ...prev,
            [category]: (prev[category] as string[]).filter((s) => s !== status),
        }));
    };

    const handleAddStatus = (category: keyof WorkflowConfig, status: string) => {
        if (!status.trim()) return;
        setConfig((prev) => ({
            ...prev,
            [category]: [...(prev[category] as string[]), status.trim()],
        }));
        setNewStatus("");
        setActiveCategory(null);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header / Context */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-brand-accent-blue/20 text-xs font-bold uppercase tracking-wide text-brand-accent-blue">
                    {source === "jira" ? (
                        <>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            AI Detected: {detectedType}
                        </>
                    ) : (
                        <>Template: {detectedType}</>
                    )}
                </div>
                <h2 className="text-2xl font-black font-heading text-brand-dark">
                    Review Workflow Settings
                </h2>
                <p className="text-brand-gray-mid text-sm max-w-sm mx-auto">
                    {description ||
                        "We've pre-configured these based on your selection. Tweak them to match your team's process."}
                </p>
            </div>

            {/* Config Sections */}
            <div className="space-y-6">
                <StatusCategory
                    title="Start Tracking"
                    description="Tasks move here when work begins."
                    statuses={config.startTracking}
                    colorClass="bg-blue-100 text-blue-700 border-blue-200"
                    onRemove={(s) => handleRemoveStatus("startTracking", s)}
                    onAdd={(s) => handleAddStatus("startTracking", s)}
                />

                <StatusCategory
                    title="In Review"
                    description="Tasks move here for QA or Code Review."
                    statuses={config.reviewStatus}
                    colorClass="bg-purple-100 text-purple-700 border-purple-200"
                    onRemove={(s) => handleRemoveStatus("reviewStatus", s)}
                    onAdd={(s) => handleAddStatus("reviewStatus", s)}
                />

                <StatusCategory
                    title="Done"
                    description="Tasks are considered finished."
                    statuses={config.doneStatus}
                    colorClass="bg-green-100 text-green-700 border-green-200"
                    onRemove={(s) => handleRemoveStatus("doneStatus", s)}
                    onAdd={(s) => handleAddStatus("doneStatus", s)}
                />

                <div className="pt-2 border-t border-brand-gray-light/50"></div>

                {/* Proof Packet Rules: Excluded Task Types */}
                <StatusCategory
                    title="Excluded Task Types"
                    description="Tasks of these types will NOT generate Proof Packets (e.g. Sub-task)."
                    statuses={config.excludedTaskTypes || []}
                    colorClass="bg-gray-100 text-gray-700 border-gray-200"
                    onRemove={(s) => {
                        const current = config.excludedTaskTypes || [];
                        setConfig(prev => ({ ...prev, excludedTaskTypes: current.filter(t => t !== s) }));
                    }}
                    onAdd={(s) => {
                        if (!s.trim()) return;
                        const current = config.excludedTaskTypes || [];
                        setConfig(prev => ({ ...prev, excludedTaskTypes: [...current, s.trim()] }));
                    }}
                />

                {/* Policy Tier */}
                <div className="space-y-3">
                    <div>
                        <h3 className="font-bold text-brand-dark font-heading text-sm">Compliance Policy</h3>
                        <p className="text-xs text-brand-gray-mid">Determines strictness of proof requirements.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {(["agile", "standard", "hardened"] as const).map(tier => (
                            <button
                                key={tier}
                                onClick={() => setConfig(prev => ({ ...prev, policyTier: tier }))}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-sm font-bold capitalize border-2 transition-all",
                                    config.policyTier === tier
                                        ? "border-brand-accent-blue bg-blue-50 text-brand-accent-blue"
                                        : "border-brand-gray-light bg-white text-brand-gray-mid hover:border-brand-accent-blue/50"
                                )}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-brand-gray-mid hover:text-brand-dark"
                >
                    Back
                </Button>
                <Button
                    onClick={() => onSave(config)}
                    className="h-12 px-8 bg-brand-dark text-white rounded-xl font-bold font-heading shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                    Confirm Configuration
                </Button>
            </div>
        </div>
    );
}

// ==========================================
// Subcomponents
// ==========================================

function StatusCategory({
    title,
    description,
    statuses,
    colorClass,
    onRemove,
    onAdd,
}: {
    title: string;
    description: string;
    statuses: string[];
    colorClass: string;
    onRemove: (s: string) => void;
    onAdd: (s: string) => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [val, setVal] = useState("");

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-brand-dark font-heading text-sm">{title}</h3>
                    <p className="text-xs text-brand-gray-mid">{description}</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-xs font-bold text-brand-accent-blue hover:underline"
                >
                    + Add Status
                </button>
            </div>

            <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-brand-light/50 border border-brand-gray-light/50 min-h-[80px] content-start">
                {statuses.length === 0 && (
                    <span className="text-xs text-brand-gray-mid italic py-1">
                        No statuses mapped
                    </span>
                )}

                {statuses.map((status) => (
                    <div
                        key={status}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border",
                            colorClass,
                        )}
                    >
                        {status}
                        <button
                            onClick={() => onRemove(status)}
                            className="opacity-50 hover:opacity-100 hover:bg-black/10 rounded-full p-0.5 transition-all"
                        >
                            <IconX size={12} />
                        </button>
                    </div>
                ))}

                {isAdding && (
                    <div className="flex items-center gap-2 animate-fade-in-right">
                        <Input
                            className="h-8 w-32 text-xs"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            placeholder="Status name..."
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onAdd(val);
                                    setVal("");
                                    setIsAdding(false);
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                onAdd(val);
                                setVal("");
                                setIsAdding(false);
                            }}
                            className="p-1.5 rounded-lg bg-brand-dark text-white hover:bg-black"
                        >
                            <IconPlus size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
