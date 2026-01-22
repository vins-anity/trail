import { IconBrandGithub, IconBrandSlack, IconCheckbox, IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface WorkspaceStatus {
    id: string;
    name: string;
    hasSlack: boolean;
    hasGithub: boolean;
    hasJira: boolean;
}

export function OnboardingWidget() {
    const [status, setStatus] = useState<WorkspaceStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current workspace status
        fetch(`${import.meta.env.VITE_API_URL}/workspaces/current`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch workspace status:", err);
                setLoading(false);
            });
    }, []);

    if (loading || !status) return null;

    // Calculate progress (Account Created is step 1, so start with 1 point)
    let completedSteps = 1;
    if (status.hasJira) completedSteps++;
    if (status.hasGithub) completedSteps++;
    if (status.hasSlack) completedSteps++;

    const totalSteps = 4;
    const progress = (completedSteps / totalSteps) * 100;

    // If all done, hide widget (unless forced via URL for demo)
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get("onboarding") === "true";

    console.log("[OnboardingWidget] Debug:", { completedSteps, totalSteps, forceShow, status });

    if (completedSteps === totalSteps && !forceShow) return null;

    const handleConnect = (provider: string) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}/authorize?workspaceId=${status.id}`;
    };

    return (
        <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Let's set up your Trail workspace</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Connect your tools to enable automated delivery tracking.
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
                        <span className="text-sm text-muted-foreground ml-1">Complete</span>
                    </div>
                </div>
                <Progress value={progress} className="h-2 mt-4" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {/* Jira Card */}
                    <div className={`p-4 rounded-lg border ${status.hasJira ? "bg-green-500/10 border-green-500/20" : "bg-card border-border"}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <IconCheckbox className="h-6 w-6 text-blue-500" />
                            </div>
                            {status.hasJira && (
                                <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                    Connected
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold">1. Track Work</h3>
                        <p className="text-sm text-muted-foreground mb-4 h-10">
                            Connect Jira to automatically log when work starts.
                        </p>
                        <Button
                            variant={status.hasJira ? "ghost" : "default"}
                            className="w-full"
                            onClick={() => handleConnect('jira')}
                            disabled={status.hasJira}
                        >
                            {status.hasJira ? "Connected" : "Connect Jira"}
                        </Button>
                    </div>

                    {/* GitHub Card */}
                    <div className={`p-4 rounded-lg border ${status.hasGithub ? "bg-green-500/10 border-green-500/20" : "bg-card border-border"}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                                <IconBrandGithub className="h-6 w-6 text-foreground" />
                            </div>
                            {status.hasGithub && (
                                <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                    Connected
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold">2. Verify Delivery</h3>
                        <p className="text-sm text-muted-foreground mb-4 h-10">
                            Connect GitHub to generate tamper-evident proofs.
                        </p>
                        <Button
                            variant={status.hasGithub ? "ghost" : "default"}
                            className="w-full"
                            onClick={() => handleConnect('github')}
                            disabled={status.hasGithub}
                        >
                            {status.hasGithub ? "Connected" : "Connect GitHub"}
                        </Button>
                    </div>

                    {/* Slack Card */}
                    <div className={`p-4 rounded-lg border ${status.hasSlack ? "bg-green-500/10 border-green-500/20" : "bg-card border-border"}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <IconBrandSlack className="h-6 w-6 text-purple-500" />
                            </div>
                            {status.hasSlack && (
                                <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                    Connected
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold">3. Stay Notified</h3>
                        <p className="text-sm text-muted-foreground mb-4 h-10">
                            Connect Slack to get handshake and closure alerts.
                        </p>
                        <Button
                            variant={status.hasSlack ? "ghost" : "default"}
                            className="w-full"
                            onClick={() => handleConnect('slack')}
                            disabled={status.hasSlack}
                        >
                            {status.hasSlack ? "Connected" : "Connect Slack"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
