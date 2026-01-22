import { IconActivity, IconAlertCircle, IconCircleCheck, IconClock } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useEvents } from "@/hooks/use-events";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { OnboardingWidget } from "../../components/onboarding/OnboardingWidget";

export function DashboardPage() {
    const { data: status, isLoading: statusLoading } = useWorkspaceStatus();
    const { stats, isLoading: statsLoading } = useDashboardStats();
    const { data: recentActivity, isLoading: activityLoading } = useEvents({ pageSize: 5 });

    // 1. Loading State
    if (statusLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-muted-foreground">Loading workspace...</div>
            </div>
        );
    }

    // 2. Onboarding Gate (Show ONLY widget if any service is missing)
    // Account created is step 1, so we check the 3 integrations.
    const isFullyOnboarded = status?.hasJira && status?.hasGithub && status?.hasSlack;

    if (!isFullyOnboarded) {
        return (
            <div className="max-w-2xl mx-auto mt-20">
                <OnboardingWidget />
            </div>
        );
    }

    // 3. Full Dashboard (Only shown if onboarded)
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your delivery assurance metrics.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        title: "Active Tasks",
                        value: statsLoading ? "..." : stats.activeTasks,
                        icon: IconActivity,
                        color: "text-blue-500",
                    },
                    {
                        title: "Pending Proofs",
                        value: statsLoading ? "..." : stats.pendingProofs,
                        icon: IconClock,
                        color: "text-orange-500",
                    },
                    {
                        title: "Completed",
                        value: statsLoading ? "..." : stats.completedProofs,
                        icon: IconCircleCheck,
                        color: "text-green-500",
                    },
                    {
                        title: "Vetoed",
                        value: statsLoading ? "..." : stats.vetoed,
                        icon: IconAlertCircle,
                        color: "text-red-500",
                    },
                ].map((stat) => (
                    <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">Real-time metrics</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card/50 backdrop-blur-sm border-white/5">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest events from your repositories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activityLoading ? (
                            <div className="text-sm text-muted-foreground py-8 text-center">
                                Loading activity...
                            </div>
                        ) : recentActivity?.events?.length === 0 ? (
                            <div className="text-sm text-muted-foreground py-8 text-center">
                                No recent activity found.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity?.events?.map((event: any) => (
                                    <div key={event.id} className="flex items-center gap-4">
                                        <div className="bg-muted p-2 rounded-full">
                                            <IconActivity className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {event.eventType}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(event.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-card/50 backdrop-blur-sm border-white/5">
                    <CardHeader>
                        <CardTitle>Optimistic Closures</CardTitle>
                        <CardDescription>Scheduled for auto-finalization.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground py-8 text-center">
                            No pending closures.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
