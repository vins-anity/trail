import {
    IconBrandAsana, // Using as placeholder for Jira
    IconBrandGithub,
    IconBrandSlack,
    IconCheck,
    IconArrowRight,
} from "@tabler/icons-react";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ConnectIntegrationsStepProps {
    workspaceId: string;
    onNext: () => void;
}

export function ConnectIntegrationsStep({ workspaceId, onNext }: ConnectIntegrationsStepProps) {
    const { data: workspace, isLoading } = useWorkspaceStatus();

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
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-black font-heading text-brand-dark">
                    Connect Your Stack
                </h2>
                <p className="text-brand-gray-mid text-lg max-w-lg mx-auto leading-relaxed">
                    Link your tools to enable automated tracking and proof generation.
                </p>
            </div>

            <div className="grid gap-4">
                {/* 1. Jira (Recommended First) */}
                <IntegrationCard
                    title="Jira Software"
                    description="Import projects, boards, and sync workflow status."
                    icon={<IconBrandAsana className="w-8 h-8" />}
                    connected={isJiraConnected}
                    loading={isLoading}
                    recommended
                    onConnect={() => handleConnect("jira")}
                    colorClass="bg-[#0052CC] text-white hover:bg-[#0747a6]"
                />

                {/* 2. GitHub */}
                <IntegrationCard
                    title="GitHub"
                    description="Track commits, PRs, and CI/CD pipelines."
                    icon={<IconBrandGithub className="w-8 h-8" />}
                    connected={isGithubConnected}
                    loading={isLoading}
                    onConnect={() => handleConnect("github")}
                    colorClass="bg-[#24292e] text-white hover:bg-[#2f363d]"
                />

                {/* 3. Slack (Last) */}
                <IntegrationCard
                    title="Slack"
                    description="Receive real-time notifications and closure alerts."
                    icon={<IconBrandSlack className="w-8 h-8" />}
                    connected={isSlackConnected}
                    loading={isLoading}
                    onConnect={() => handleConnect("slack")}
                    colorClass="bg-[#4A154B] text-white hover:bg-[#611f69]"
                />
            </div>

            <div className="pt-4 flex justify-end">
                <Button
                    onClick={onNext}
                    className="h-14 px-8 bg-brand-dark text-white rounded-xl font-bold font-heading shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    Continue
                    <IconArrowRight className="w-5 h-5" />
                </Button>
            </div>
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
        <Card
            className={cn(
                "border transition-all duration-300 overflow-hidden",
                connected
                    ? "border-green-500/30 bg-green-50/50"
                    : "border-brand-gray-light hover:border-brand-accent-blue/30 hover:shadow-md bg-white",
            )}
        >
            <CardContent className="p-0 flex items-center">
                {/* Icon Section */}
                <div className="p-6 flex items-center justify-center">
                    <div
                        className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
                            connected ? "bg-green-100 text-green-600" : "bg-brand-light text-brand-dark",
                        )}
                    >
                        {connected ? <IconCheck className="w-8 h-8" /> : icon}
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 py-6 pr-6">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold font-heading text-brand-dark">{title}</h3>
                        {recommended && !connected && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                                Recommended
                            </span>
                        )}
                        {connected && (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <IconCheck size={10} stroke={3} />
                                Connected
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-brand-gray-mid">{description}</p>
                </div>

                {/* Action Button */}
                <div className="pr-6">
                    {!connected ? (
                        <Button
                            onClick={onConnect}
                            disabled={loading}
                            className={cn("h-10 px-5 rounded-lg font-bold text-sm shadow-sm transition-all", colorClass)}
                        >
                            Connect
                        </Button>
                    ) : (
                        <Button variant="ghost" className="text-brand-gray-mid hover:text-red-500 text-sm h-10 px-4" disabled>
                            Connected
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
