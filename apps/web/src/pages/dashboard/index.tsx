import { IconActivity, IconAlertCircle, IconCircleCheck, IconClock, IconTrendingUp } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCardSkeleton, ActivitySkeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useEvents } from "@/hooks/use-events";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { OnboardingWidget } from "../../components/onboarding/OnboardingWidget";

export function DashboardPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { data: status, isLoading: statusLoading } = useWorkspaceStatus();
    const { stats, isLoading: statsLoading } = useDashboardStats();
    const { data: recentActivity, isLoading: activityLoading } = useEvents({ pageSize: 5 });

    // Handle OAuth success redirect
    useEffect(() => {
        const connectedProvider = searchParams.get("connected");
        if (connectedProvider) {
            // Invalidate workspace status to fetch latest integration status
            queryClient.invalidateQueries({ queryKey: ["workspace-status"] });

            // Allow time for refetch then clear param
            setTimeout(() => {
                setSearchParams({}, { replace: true });
            }, 1000);
        }
    }, [searchParams, queryClient, setSearchParams]);

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
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your delivery assurance metrics.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    [
                        {
                            title: "Active Tasks",
                            value: stats.activeTasks,
                            icon: IconActivity,
                            color: "text-blue-500",
                            bgColor: "bg-blue-500/10",
                            trend: "+12%",
                        },
                        {
                            title: "Pending Proofs",
                            value: stats.pendingProofs,
                            icon: IconClock,
                            color: "text-orange-500",
                            bgColor: "bg-orange-500/10",
                            trend: "+5%",
                        },
                        {
                            title: "Completed",
                            value: stats.completedProofs,
                            icon: IconCircleCheck,
                            color: "text-green-500",
                            bgColor: "bg-green-500/10",
                            trend: "+23%",
                        },
                        {
                            title: "Vetoed",
                            value: stats.vetoed,
                            icon: IconAlertCircle,
                            color: "text-red-500",
                            bgColor: "bg-red-500/10",
                            trend: "-8%",
                        },
                    ].map((stat, index) => (
                        <Card
                            key={stat.title}
                            className="bg-card/50 backdrop-blur-sm border-white/5 hover-lift cursor-pointer"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <IconTrendingUp className="h-3 w-3 text-green-500" />
                                    <p className="text-xs text-muted-foreground">{stat.trend} this week</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card/50 backdrop-blur-sm border-white/5">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest events from your repositories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activityLoading ? (
                            <div className="space-y-4">
                                <ActivitySkeleton />
                                <ActivitySkeleton />
                                <ActivitySkeleton />
                                <ActivitySkeleton />
                            </div>
                        ) : recentActivity?.events?.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                    <IconActivity className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-foreground mb-1">No recent activity</p>
                                <p className="text-xs text-muted-foreground">Activity will appear here once you start tracking work</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity?.events?.map((event: any) => (
                                    <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <IconActivity className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1 flex-1">
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
                        <div className="text-center py-12">
                            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                <IconCircleCheck className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">All clear</p>
                            <p className="text-xs text-muted-foreground">No pending closures at this time</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
