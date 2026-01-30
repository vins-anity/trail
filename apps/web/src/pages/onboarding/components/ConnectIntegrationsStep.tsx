import {
    IconArrowRight,
    IconBrandAsana, // Using as placeholder for Jira
    IconBrandGithub,
    IconBrandSlack,
    IconCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ConnectIntegrationsStepProps {
    workspaceId: string;
    onNext: () => void;
}

export function ConnectIntegrationsStep({ workspaceId, onNext }: ConnectIntegrationsStepProps) {
    const { data: workspace, isLoading } = useWorkspaceStatus();
    const queryClient = useQueryClient();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const connected = params.get("connected");
        const error = params.get("error");

        if (connected) {
            toast.success(`${connected.charAt(0).toUpperCase() + connected.slice(1)} linked successfully!`, {
                description: "Your integration is now active.",
            });
            // Refresh workspace data to show the green checkmark
            queryClient.invalidateQueries({ queryKey: ["workspace-status"] });
            // Clean up URL
            window.history.replaceState({}, "", "/onboarding?step=integrations");
        }

        if (error) {
            toast.error("Integration failed", {
                description: decodeURIComponent(error),
            });
            // Clean up URL
            window.history.replaceState({}, "", "/onboarding?step=integrations");
        }
    }, [queryClient]);

    const handleConnect = (provider: "jira" | "github" | "slack") => {
        const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
        // Encode the current path with wizard state if possible, but for now
        // we assume the wizard wrapper will restore state based on URL or local storage if needed.
        // We pass 'next' param to ensuring we return to onboarding.
        const next = "/onboarding?step=integrations";
        window.location.href = `${baseUrl}/auth/${provider}/authorize?workspace_id=${workspaceId}&next=${encodeURIComponent(next)}`;
    };

    const isJiraConnected = !!workspace?.hasJira;
    const isGithubConnected = !!workspace?.hasGithub;
    const isSlackConnected = !!workspace?.hasSlack;

    return (
        <div className="relative z-10 w-full max-w-2xl px-6 animate-fade-in-up mx-auto">
            {/* Brand Header */}
            <div className="text-center mb-10 space-y-4">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-brand-dark shadow-2xl mb-4 group transform transition-transform hover:scale-105 duration-500">
                    <div className="w-8 h-8 text-brand-light group-hover:rotate-12 transition-transform duration-500">
                        {/* Stack Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2L2 7l10 5l10-5l-10-5z" />
                            <path d="M2 17l10 5l10-5" />
                            <path d="M2 12l10 5l10-5" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-5xl font-black font-heading tracking-tight text-brand-dark leading-[1.1]">
                    Connect Your Stack
                </h1>
                <p className="text-brand-gray-mid text-lg font-serif italic max-w-lg mx-auto">
                    Link your tools to enable automated tracking.
                </p>
            </div>

            {/* Glass Card */}
            <Card className="border-brand-gray-light bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        {/* 1. Jira (Recommended First) */}
                        <IntegrationCard
                            title="Jira Software"
                            description="Import projects & sync status."
                            icon={<IconBrandAsana className="w-6 h-6" />}
                            connected={isJiraConnected}
                            loading={isLoading}
                            recommended
                            onConnect={() => handleConnect("jira")}
                            colorClass="bg-[#0052CC] text-white hover:bg-[#0747a6]"
                        />

                        {/* 2. GitHub */}
                        <IntegrationCard
                            title="GitHub"
                            description="Track commits & CI/CD."
                            icon={<IconBrandGithub className="w-6 h-6" />}
                            connected={isGithubConnected}
                            loading={isLoading}
                            onConnect={() => handleConnect("github")}
                            colorClass="bg-[#24292e] text-white hover:bg-[#2f363d]"
                        />

                        {/* 3. Slack (Last) */}
                        <IntegrationCard
                            title="Slack"
                            description="Real-time notifications."
                            icon={<IconBrandSlack className="w-6 h-6" />}
                            connected={isSlackConnected}
                            loading={isLoading}
                            onConnect={() => handleConnect("slack")}
                            colorClass="bg-[#4A154B] text-white hover:bg-[#611f69]"
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={onNext}
                            className="w-full h-14 text-lg font-bold font-heading rounded-xl bg-brand-dark text-brand-light hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-3"
                        >
                            Continue to Policy Setup
                            <IconArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function IntegrationCard({
    title,
    description,
    icon,
    connected,
    loading,
    recommended,
    onConnect,
    colorClass,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    connected: boolean;
    loading: boolean;
    recommended?: boolean;
    onConnect: () => void;
    colorClass: string;
}) {
    return (
        <div
            className={cn(
                "group relative flex items-center p-4 rounded-xl border transition-all duration-300",
                connected
                    ? "border-green-200 bg-green-50/50"
                    : "border-brand-gray-light/30 bg-white hover:border-brand-accent-blue/50 hover:shadow-lg hover:shadow-brand-accent-blue/5"
            )}
        >
            {/* Icon */}
            <div
                className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    connected ? "bg-green-100 text-green-600" : "bg-brand-light text-brand-dark group-hover:bg-white group-hover:shadow-sm"
                )}
            >
                {connected ? <IconCheck className="w-6 h-6" /> : icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 ml-4 mr-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-heading text-brand-dark truncate">
                        {title}
                    </h3>
                    {recommended && !connected && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                            Recommended
                        </span>
                    )}
                </div>
                <p className="text-sm text-brand-gray-mid truncate">{description}</p>
            </div>

            {/* Action */}
            <div className="flex-shrink-0">
                {!connected ? (
                    <Button
                        onClick={onConnect}
                        disabled={loading}
                        size="sm"
                        className={cn(
                            "h-9 px-4 rounded-lg font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95",
                            colorClass,
                        )}
                    >
                        Connect
                    </Button>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wide px-3 py-1.5 rounded-lg bg-green-100/50">
                        <IconCheck size={12} stroke={3} />
                        Linked
                    </div>
                )}
            </div>
        </div>
    );
}
