import {
    IconArrowRight,
    IconBrandGithub,
    IconBrandSlack,
    IconCheckbox,
    IconCircleCheckFilled,
    IconLoader2,
} from "@tabler/icons-react";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function OnboardingWidget({ workspaceId }: { workspaceId?: string | null }) {
    const { data: status, isLoading } = useWorkspaceStatus(workspaceId);

    if (isLoading || !status)
        return (
            <div className="max-w-5xl mx-auto h-64 flex items-center justify-center">
                <IconLoader2 className="w-8 h-8 text-brand-gray-light animate-spin" />
            </div>
        );

    // Calculate progress
    let completedSteps = 1; // Account created
    if (status.hasJira) completedSteps++;
    if (status.hasGithub) completedSteps++;
    if (status.hasSlack) completedSteps++;

    const totalSteps = 4;
    const progress = (completedSteps / totalSteps) * 100;
    const isComplete = progress === 100;

    const handleConnect = (provider: string) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}/authorize?workspace_id=${status.id}`;
    };

    const handleLaunch = async () => {
        // Mark onboarding as complete in the backend
        try {
            const token = localStorage.getItem("supabase.auth.token");
            const session = token ? JSON.parse(token) : null;
            const accessToken = session?.currentSession?.access_token;

            await fetch(`${import.meta.env.VITE_API_URL}/workspaces/${status.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: accessToken ? `Bearer ${accessToken}` : "",
                },
                body: JSON.stringify({
                    onboardingCompletedAt: new Date().toISOString(),
                }),
            });
            window.location.reload();
        } catch (e) {
            console.error("Failed to complete onboarding:", e);
            window.location.reload();
        }
    };

    return (
        <div className="relative group max-w-5xl mx-auto font-sans">
            {/* Background Decor */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-accent-orange/10 via-brand-accent-blue/10 to-brand-accent-green/10 rounded-[2rem] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>

            <Card className="relative mb-12 border-brand-gray-light bg-white/80 backdrop-blur-xl shadow-xl rounded-[1.8rem] overflow-hidden">
                {/* Progress Bar Top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-light">
                    <div
                        className="h-full bg-gradient-to-r from-brand-accent-orange via-brand-accent-blue to-brand-accent-green transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <CardHeader className="pt-10 pb-6 px-10 border-b border-brand-gray-light/30">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant="outline"
                                    className="border-brand-accent-blue/30 text-brand-accent-blue bg-brand-accent-blue/5 uppercase tracking-wider text-[10px] font-bold px-2 py-0.5"
                                >
                                    {isComplete ? "Ready" : "Setup Required"}
                                </Badge>
                                <span className="text-xs font-medium text-brand-gray-mid font-mono">
                                    Step {completedSteps} of {totalSteps}
                                </span>
                            </div>
                            <CardTitle className="text-3xl md:text-4xl font-black font-heading text-brand-dark tracking-tight">
                                {isComplete
                                    ? "ShipDocket is Ready to Launch"
                                    : "Initialize Your Workspace"}
                            </CardTitle>
                            <p className="text-lg text-brand-gray-mid font-serif italic max-w-2xl">
                                {isComplete
                                    ? "All integrations are active. Systems are go."
                                    : "Connect your core tools to begin automated tracking and proof generation."}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <div className="relative h-20 w-20 flex items-center justify-center">
                                <svg
                                    className="h-full w-full -rotate-90"
                                    viewBox="0 0 36 36"
                                    aria-label="Progress circle"
                                >
                                    <path
                                        className="text-brand-light"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                    <path
                                        className="text-brand-dark transition-all duration-1000 ease-out"
                                        strokeDasharray={`${progress}, 100`}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-sm font-bold text-brand-dark">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-10 py-10">
                    {!isComplete ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <OnboardingCard
                                step="01"
                                title="Track Work"
                                description="Connect Jira to passively detect when work starts."
                                icon={<IconCheckbox className="h-6 w-6 text-brand-light" />}
                                iconBg="bg-brand-accent-blue"
                                isConnected={status.hasJira}
                                onConnect={() => handleConnect("jira")}
                                label="Jira"
                            />

                            <OnboardingCard
                                step="02"
                                title="Verify Delivery"
                                description="Connect GitHub to collect evidence automatically."
                                icon={<IconBrandGithub className="h-6 w-6 text-brand-dark" />}
                                iconBg="bg-white border border-brand-gray-light text-brand-dark"
                                isConnected={status.hasGithub}
                                onConnect={() => handleConnect("github")}
                                label="GitHub"
                            />

                            <OnboardingCard
                                step="03"
                                title="Stay Notified"
                                description="Connect Slack for real-time alerts and vetoes."
                                icon={<IconBrandSlack className="h-6 w-6 text-brand-light" />}
                                iconBg="bg-brand-accent-orange"
                                isConnected={status.hasSlack}
                                onConnect={() => handleConnect("slack")}
                                label="Slack"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-8">
                            <div className="w-24 h-24 rounded-full bg-brand-accent-green/10 flex items-center justify-center animate-bounce-slow">
                                <IconCircleCheckFilled className="h-12 w-12 text-brand-accent-green" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold font-heading text-brand-dark">
                                    Configuration Complete
                                </h3>
                                <p className="text-brand-gray-mid max-w-md mx-auto">
                                    Your environment is fully synchronized. ShipDocket is now
                                    passively monitoring your development cycle.
                                </p>
                            </div>
                            <Button
                                size="lg"
                                className="bg-brand-dark text-brand-light hover:bg-brand-accent-blue transition-all duration-300 rounded-xl px-8 h-12 text-base font-bold shadow-lg shadow-brand-dark/10"
                                onClick={handleLaunch}
                            >
                                Launch Dashboard
                                <IconArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

interface OnboardingCardProps {
    step: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string; // Tailswind classes string
    isConnected: boolean;
    onConnect: () => void;
    label: string;
}

function OnboardingCard({
    step,
    title,
    description,
    icon,
    iconBg,
    isConnected,
    onConnect,
    label,
}: OnboardingCardProps) {
    return (
        <div
            className={cn(
                "group relative p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full",
                isConnected
                    ? "bg-brand-light border-brand-accent-green/20"
                    : "bg-white border-brand-gray-light hover:border-brand-accent-blue/30 hover:shadow-lg hover:shadow-brand-accent-blue/5 hover:-translate-y-1",
            )}
        >
            <div className="flex items-start justify-between mb-6">
                <div
                    className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105",
                        isConnected ? "bg-brand-accent-green/10" : iconBg,
                    )}
                >
                    {isConnected ? (
                        <IconCircleCheckFilled className="w-6 h-6 text-brand-accent-green" />
                    ) : (
                        icon
                    )}
                </div>
                <span
                    className={cn(
                        "text-6xl font-black font-heading leading-none opacity-5 select-none transition-colors",
                        isConnected ? "text-brand-accent-green" : "text-brand-dark",
                    )}
                >
                    {step}
                </span>
            </div>

            <div className="space-y-2 flex-1">
                <h3
                    className={cn(
                        "font-bold text-lg font-heading",
                        isConnected ? "text-brand-accent-green" : "text-brand-dark",
                    )}
                >
                    {title}
                </h3>
                <p className="text-sm text-brand-gray-mid leading-relaxed">{description}</p>
            </div>

            <div className="mt-8">
                <Button
                    onClick={onConnect}
                    disabled={isConnected}
                    variant={isConnected ? "ghost" : "default"}
                    className={cn(
                        "w-full h-11 rounded-xl font-bold transition-all duration-200 border",
                        isConnected
                            ? "bg-transparent text-brand-accent-green border-transparent"
                            : "bg-brand-light text-brand-dark border-brand-gray-light hover:bg-brand-dark hover:text-brand-light hover:border-brand-dark",
                    )}
                >
                    {isConnected ? "Connected" : `Connect ${label}`}
                </Button>
            </div>
        </div>
    );
}
