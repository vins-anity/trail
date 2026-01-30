import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { useJiraAnalysis, useGitHubAnalysis } from "@/hooks/use-onboarding-analysis";
import { CreateWorkspaceStep } from "./CreateWorkspaceStep";
import { ConnectIntegrationsStep } from "./ConnectIntegrationsStep";
import { TemplateSelector, type WorkflowTemplate } from "./TemplateSelector";
import { ReviewConfigStep, type WorkflowConfig } from "./ReviewConfigStep";
import { api } from "@/lib/api";
import { IconLoader2 } from "@tabler/icons-react";

type Step = "create" | "integrations" | "template" | "review" | "saving";

export function OnboardingWizard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [step, setStep] = useState<Step>("create");

    // Config State
    const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfig | null>(null);
    const [configSource, setConfigSource] = useState<"jira" | "template" | "manual">("manual");
    const [detectedType, setDetectedType] = useState<string>("");

    // Queries
    const { data: workspaceStatus, refetch: refetchStatus } = useWorkspaceStatus();
    const { data: jiraAnalysis, isLoading: analyzingJira } = useJiraAnalysis(
        workspaceId || "",
        step === "review" && configSource === "jira"
    );
    // We can use GitHub analysis to refine CI rules, but for now we focus on Jira for workflow
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: githubAnalysis } = useGitHubAnalysis(
        workspaceId || "",
        step === "review" // Fetch whenever we are in review to check for CI
    );

    // Initial hydration from URL
    useEffect(() => {
        const sid = searchParams.get("workspace_id");
        const stepParam = searchParams.get("step");

        if (sid) {
            setWorkspaceId(sid);
            // If we have an ID but no step, default to integrations
            if (!stepParam && step === "create") {
                setStep("integrations");
            } else if (stepParam) {
                setStep(stepParam as Step);
            }
        }
    }, [searchParams, step]);

    // Handle updates
    const updateStep = (newStep: Step) => {
        setStep(newStep);
        if (workspaceId) {
            setSearchParams({ workspace_id: workspaceId, step: newStep });
        }
    };

    const handleWorkspaceCreated = (ws: { id: string }) => {
        setWorkspaceId(ws.id);
        updateStep("integrations");
        refetchStatus();
    };

    const handleIntegrationsContinue = async () => {
        // Refetch status to ensure we have latest connections
        const status = await refetchStatus();
        const hasJira = status.data?.hasJira;

        if (hasJira) {
            // If Jira connected, go straight to Review (fetch analysis)
            setConfigSource("jira");
            updateStep("review");
        } else {
            // Else, go to Template Selector
            updateStep("template");
        }
    };

    const handleTemplateSelect = (template: WorkflowTemplate) => {
        setWorkflowConfig({
            ...template.config,
            excludedTaskTypes: [], // Default
        });
        setConfigSource("template");
        setDetectedType(template.name);
        updateStep("review");
    };

    const handleConfigSave = async (finalConfig: WorkflowConfig) => {
        if (!workspaceId) return;
        updateStep("saving");

        try {
            await api.workspaces.update(workspaceId, {
                workflowSettings: {
                    startTracking: finalConfig.startTracking,
                    reviewStatus: finalConfig.reviewStatus,
                    doneStatus: finalConfig.doneStatus,
                },
                proofPacketRules: {
                    autoCreateOnDone: true,
                    minEventsForProof: 5,
                    excludedTaskTypes: finalConfig.excludedTaskTypes || []
                },
                defaultPolicyTier: finalConfig.policyTier || "standard",
                onboardingCompletedAt: new Date()
            });

            // Done! specific redirect?
            navigate("/dashboard");
        } catch (err) {
            console.error("Failed to save config", err);
            // Show error state?
            updateStep("review"); // Go back
        }
    };

    // Effect to populate config from Jira Analysis
    useEffect(() => {
        if (configSource === "jira" && jiraAnalysis) {
            setWorkflowConfig({
                startTracking: jiraAnalysis.suggestedConfig.startTracking,
                reviewStatus: jiraAnalysis.suggestedConfig.reviewStatus,
                doneStatus: jiraAnalysis.suggestedConfig.doneStatus,
                excludedTaskTypes: jiraAnalysis.suggestedConfig.excludedTaskTypes,
                policyTier: jiraAnalysis.suggestedConfig.policyTier,
            });
            setDetectedType(jiraAnalysis.detectedType);
        }
    }, [configSource, jiraAnalysis]);

    // Render Steps
    if (step === "create") {
        return <CreateWorkspaceStep onComplete={handleWorkspaceCreated} />;
    }

    if (step === "integrations") {
        return (
            <ConnectIntegrationsStep
                workspaceId={workspaceId!}
                onNext={handleIntegrationsContinue}
            />
        );
    }

    if (step === "template") {
        return (
            <div className="max-w-4xl mx-auto px-6 animate-fade-in-up">
                <div className="text-center mb-8 space-y-2">
                    <h2 className="text-3xl font-black font-heading text-brand-dark">Choose a Workflow</h2>
                    <p className="text-brand-gray-mid">Select a template to get started quickly.</p>
                </div>
                <TemplateSelector onSelect={handleTemplateSelect} />
                <div className="mt-8 text-center">
                    <button
                        onClick={() => updateStep("integrations")}
                        className="text-sm text-brand-gray-mid hover:underline"
                    >
                        &larr; Back to Integrations
                    </button>
                </div>
            </div>
        );
    }

    if (step === "review") {
        // If analyzing Jira, show loader
        if (configSource === "jira" && analyzingJira) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
                    <IconLoader2 className="w-12 h-12 text-brand-accent-blue animate-spin mb-4" />
                    <h3 className="text-xl font-bold font-heading text-brand-dark">Analyzing Jira Projects...</h3>
                    <p className="text-brand-gray-mid">Detecting workflow statuses and configuration.</p>
                </div>
            );
        }

        if (workflowConfig) {
            return (
                <div className="max-w-2xl mx-auto px-6">
                    <ReviewConfigStep
                        initialConfig={workflowConfig}
                        source={configSource}
                        detectedType={detectedType}
                        onSave={handleConfigSave}
                        onBack={() => updateStep(configSource === "jira" ? "integrations" : "template")}
                    />
                </div>
            );
        }

        // Fallback if no config (shouldn't happen)
        return <div>Loading configuration...</div>;
    }

    if (step === "saving") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
                <IconLoader2 className="w-12 h-12 text-brand-accent-green animate-spin mb-4" />
                <h3 className="text-xl font-bold font-heading text-brand-dark">Setting up Command Center...</h3>
            </div>
        );
    }

    return null;
}
