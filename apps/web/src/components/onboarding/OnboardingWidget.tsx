import { IconBrandGithub, IconBrandSlack, IconCheckbox, IconCircleCheckFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";

export function OnboardingWidget() {
    const { data: status, isLoading } = useWorkspaceStatus();

    if (isLoading || !status) return null;

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

    return (
        <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

            <Card className="relative mb-8 border-white/10 bg-black/40 backdrop-blur-md overflow-hidden animate-fade-in shadow-2xl">
                {/* Progress highlight line at the very top */}
                <div
                    className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-primary to-purple-500 transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />

                <CardHeader className="pb-3 pt-8 px-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                                {isComplete ? "Trail is ready to launch!" : "Set up your Trail workspace"}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {isComplete
                                    ? "All integrations are active. You're ready to track delivery assurance."
                                    : "Connect your core tools to begin automated tracking and proof generation."}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-primary animate-pulse-glow">{Math.round(progress)}%</span>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Complete</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-8 pb-8 pt-4">
                    {!isComplete ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Jira Card */}
                            <OnboardingCard
                                title="1. Track Work"
                                description="Connect Jira to passively detect when work starts."
                                icon={<IconCheckbox className="h-6 w-6 text-blue-400" />}
                                iconBg="bg-blue-500/10"
                                isConnected={status.hasJira}
                                onConnect={() => handleConnect('jira')}
                                label="Jira"
                            />

                            {/* GitHub Card */}
                            <OnboardingCard
                                title="2. Verify Delivery"
                                description="Connect GitHub to collect evidence automatically."
                                icon={<IconBrandGithub className="h-6 w-6 text-slate-200" />}
                                iconBg="bg-slate-500/10"
                                isConnected={status.hasGithub}
                                onConnect={() => handleConnect('github')}
                                label="GitHub"
                            />

                            {/* Slack Card */}
                            <OnboardingCard
                                title="3. Stay Notified"
                                description="Connect Slack for real-time alerts and vetoes."
                                icon={<IconBrandSlack className="h-6 w-6 text-purple-400" />}
                                iconBg="bg-purple-500/10"
                                isConnected={status.hasSlack}
                                onConnect={() => handleConnect('slack')}
                                label="Slack"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-slide-up">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                                    <IconCircleCheckFilled className="h-12 w-12 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Workspace Configuration Complete</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Your environment is fully synchronized. Trail is now passively monitoring your development cycle.
                                </p>
                            </div>
                            <Button
                                size="lg"
                                className="px-12 py-6 text-lg font-bold rounded-full shadow-[0_0_30px_-5px_rgba(var(--primary),0.5)] hover:shadow-[0_0_40px_-5px_rgba(var(--primary),0.7)] transition-all duration-300"
                                onClick={() => window.location.reload()}
                            >
                                Launch Dashboard
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

interface OnboardingCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string;
    isConnected: boolean;
    onConnect: () => void;
    label: string;
}

function OnboardingCard({ title, description, icon, iconBg, isConnected, onConnect, label }: OnboardingCardProps) {
    return (
        <div className={cn(
            "p-6 rounded-xl border transition-all duration-500 flex flex-col h-full relative overflow-hidden group/card",
            isConnected
                ? "bg-green-500/5 border-green-500/20"
                : "bg-white/5 border-white/5 hover:border-primary/50 hover:bg-white/10"
        )}>
            {isConnected && (
                <div className="absolute top-0 right-0 p-2">
                    <IconCircleCheckFilled className="h-5 w-5 text-green-500" />
                </div>
            )}

            <div className="flex items-center gap-4 mb-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover/card:scale-110", iconBg)}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{title}</h3>
                </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6 flex-1 italic line-clamp-2">
                {description}
            </p>

            <Button
                variant={isConnected ? "ghost" : "default"}
                className={cn(
                    "w-full rounded-lg font-bold transition-all duration-300",
                    isConnected
                        ? "text-green-500 bg-green-500/10 pointer-events-none"
                        : "bg-primary hover:scale-[1.02] active:scale-95"
                )}
                onClick={onConnect}
                disabled={isConnected}
            >
                {isConnected ? "Connected" : `Connect ${label}`}
            </Button>
        </div>
    );
}

