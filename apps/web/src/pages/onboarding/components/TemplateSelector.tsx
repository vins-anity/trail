import {
    IconLayoutKanban,
    IconListCheck,
    IconTimeline,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ==========================================
// Types
// ==========================================

export type WorkflowTemplateId = "kanban" | "scrum" | "project_management";

export interface WorkflowTemplate {
    id: WorkflowTemplateId;
    name: string;
    description: string;
    icon: React.ReactNode;
    config: {
        startTracking: string[];
        reviewStatus: string[];
        doneStatus: string[];
        policyTier: "agile" | "standard" | "hardened";
    };
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
    {
        id: "kanban",
        name: "Kanban",
        description: "Visualize work and maximize efficiency with a continuous flow.",
        icon: <IconLayoutKanban className="w-8 h-8" />,
        config: {
            startTracking: ["In Progress", "Doing"],
            reviewStatus: [], // Kanban often doesn't enforce a distinct review phase
            doneStatus: ["Done"],
            policyTier: "agile",
        },
    },
    {
        id: "scrum",
        name: "Scrum",
        description: "Plan, prioritize, and schedule sprints using the scrum framework.",
        icon: <IconListCheck className="w-8 h-8" />,
        config: {
            startTracking: ["In Progress"],
            reviewStatus: ["In Review", "Code Review"],
            doneStatus: ["Done", "Closed"],
            policyTier: "standard",
        },
    },
    {
        id: "project_management",
        name: "Project Management",
        description: "Manage projects with a structured lifecycle and approval gates.",
        icon: <IconTimeline className="w-8 h-8" />,
        config: {
            startTracking: ["Active", "In Progress"],
            reviewStatus: ["Pending Approval"],
            doneStatus: ["Complete", "Closed"],
            policyTier: "standard",
        },
    },
];

// ==========================================
// Component
// ==========================================

interface TemplateSelectorProps {
    onSelect: (template: WorkflowTemplate) => void;
    selectedId?: WorkflowTemplateId;
    className?: string;
}

export function TemplateSelector({
    onSelect,
    selectedId,
    className,
}: TemplateSelectorProps) {
    return (
        <div className={cn("grid grid-cols-1 gap-4", className)}>
            {WORKFLOW_TEMPLATES.map((template) => {
                const isSelected = selectedId === template.id;
                return (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template)}
                        type="button"
                        className={cn(
                            "flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 group relative overflow-hidden",
                            isSelected
                                ? "border-brand-accent-blue bg-blue-50/50 shadow-lg ring-1 ring-brand-accent-blue/20"
                                : "border-gray-200 bg-white hover:border-brand-accent-blue/30 hover:bg-gray-50",
                        )}
                    >
                        {/* Icon Box */}
                        <div
                            className={cn(
                                "flex-shrink-0 p-3 rounded-xl transition-colors duration-300",
                                isSelected
                                    ? "bg-brand-accent-blue text-white shadow-md transform scale-105"
                                    : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600",
                            )}
                        >
                            {template.icon}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <h3
                                className={cn(
                                    "text-lg font-bold font-heading mb-1 transition-colors",
                                    isSelected
                                        ? "text-brand-accent-blue"
                                        : "text-gray-900 group-hover:text-blue-900",
                                )}
                            >
                                {template.name}
                            </h3>
                            <p
                                className={cn(
                                    "text-sm font-medium leading-relaxed",
                                    isSelected
                                        ? "text-blue-700/80"
                                        : "text-gray-500 group-hover:text-gray-600",
                                )}
                            >
                                {template.description}
                            </p>
                        </div>

                        {/* Indicator Dot */}
                        <div
                            className={cn(
                                "absolute top-5 right-5 w-4 h-4 rounded-full border-2 transition-all duration-300",
                                isSelected
                                    ? "border-brand-accent-blue bg-brand-accent-blue scale-100"
                                    : "border-gray-300 bg-transparent group-hover:border-blue-300",
                            )}
                        >
                            {isSelected && (
                                <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
