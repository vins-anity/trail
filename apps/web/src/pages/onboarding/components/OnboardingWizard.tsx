import { IconLoader2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { api } from "@/lib/api";
import { SelectAudienceStep } from "./SelectAudienceStep";
import { SelectCultureStep } from "./SelectCultureStep";
import { SelectStackStep } from "./SelectStackStep";

type Step =
    | "create"
    | "select_stack"
    | "select_culture"
    | "select_audience"
    | "saving";

// Helper for "Scrum" vs "Kanban" defaults
const WORKFLOW_DEFAULTS = {
    scrum: {
        startTracking: ["In Progress"],
        reviewStatus: ["In Review"],
        doneStatus: ["Done"],
        policyTier: "standard",
    },
    kanban: {
        startTracking: ["Selected for Development", "In Progress"],
        reviewStatus: ["In Review"],
        doneStatus: ["Done"],
        policyTier: "agile",
    },
};

export function OnboardingWizard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [step, setStep] = useState<Step>("create");

    // Wizard State
    const [teamType, setTeamType] = useState<string>("agency");
    const [stack, setStack] = useState<string[]>([]);
    const [culture, setCulture] = useState<"scrum" | "kanban">("scrum");
    const [audience, setAudience] = useState<"internal" | "clients">("internal");

    // Queries
    const { refetch: refetchStatus } = useWorkspaceStatus(workspaceId);

    const urlWorkspaceId = searchParams.get("workspace_id");
    const stepParam = searchParams.get("step");

    // Initial hydration from URL
    useEffect(() => {
        if (urlWorkspaceId) {
            setWorkspaceId(urlWorkspaceId);
            // If we have an ID but no step, default to integrations
            if (!stepParam && step === "create") {
                setStep("select_stack");
            } else if (stepParam && stepParam !== step) {
                setStep(stepParam as Step);
            }
        }
    }, [urlWorkspaceId, stepParam, step]);

    // Handle updates
    const updateStep = (newStep: Step) => {
        setStep(newStep);
        if (workspaceId) {
            setSearchParams({ workspace_id: workspaceId, step: newStep });
        }
    };

    const handleWorkspaceCreated = (ws: { id: string; workflowSettings?: any }) => {
        setWorkspaceId(ws.id);
        if (ws.workflowSettings?.teamType) {
            setTeamType(ws.workflowSettings.teamType);
        }
        updateStep("select_stack");
        refetchStatus();
    };

    const handleStackSelected = (selectedStack: string[]) => {
        setStack(selectedStack);
        updateStep("select_culture");
    };

    const handleCultureSelected = (selectedCulture: "scrum" | "kanban") => {
        setCulture(selectedCulture);
        updateStep("select_audience");
    };

    const handleAudienceSelected = async (selectedAudience: "internal" | "clients") => {
        setAudience(selectedAudience);
        await handleFinalSave(selectedAudience);
    };

    const handleFinalSave = async (finalAudience: "internal" | "clients") => {
        if (!workspaceId) return;
        updateStep("saving");

        try {
            // Determine defaults based on Culture
            const defaults = WORKFLOW_DEFAULTS[culture];

            // Build final payload
            await api.workspaces.update(workspaceId, {
                workflowSettings: {
                    teamType,
                    stack,
                    culture,
                    audience: finalAudience,
                    startTracking: defaults.startTracking,
                    reviewStatus: defaults.reviewStatus,
                    doneStatus: defaults.doneStatus,
                },
                proofPacketRules: {
                    autoCreateOnDone: true,
                    minEventsForProof: 5,
                    excludedTaskTypes: [], // Simple default
                    enableClientPortal: finalAudience === "clients",
                },
                defaultPolicyTier: defaults.policyTier as any,
                onboardingCompletedAt: new Date(),
            });

            // Redirect with success state
            navigate("/dashboard");
        } catch (err) {
            console.error("Failed to save config", err);
            // In a real app, show error toast
            // fallback to dashboard anyway?
            navigate("/dashboard");
        }
    };

    // Render Steps
    if (step === "select_stack") {
        return (
            <SelectStackStep
                teamType={teamType}
                onNext={handleStackSelected}
                onBack={() => {
                    // If workspaceId exists, it means we came from a workspace creation.
                    // If not, it means we are starting fresh, so no back action.
                    if (workspaceId) {
                        // This path is not explicitly defined in the new flow,
                        // but keeping it for robustness if a "create" step is re-introduced
                        // or if the initial state needs to be reset.
                        // For now, it effectively does nothing if workspaceId is null.
                    }
                }}
            />
        );
    }

    if (step === "select_culture") {
        return (
            <SelectCultureStep
                teamType={teamType}
                onNext={handleCultureSelected}
                onBack={() => updateStep("select_stack")}
            />
        );
    }

    if (step === "select_audience") {
        return (
            <SelectAudienceStep
                onNext={handleAudienceSelected}
                onBack={() => updateStep("select_culture")}
            />
        );
    }

    if (step === "saving") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
                <IconLoader2 className="w-12 h-12 text-brand-accent-green animate-spin mb-4" />
                <h3 className="text-xl font-bold font-heading text-brand-dark">
                    Setting up Command Center...
                </h3>
            </div>
        );
    }

    return null;
}
