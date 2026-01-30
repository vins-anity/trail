import {
    IconActivity,
    IconAlertCircle,
    IconBrandGithub,
    IconBrandTrello,
    IconCircleCheck,
    IconClock,
    IconLink,
    IconShieldCheck,
    IconTrendingUp,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitySkeleton, StatCardSkeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useEvents } from "@/hooks/use-events";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { OnboardingWidget } from "../../components/onboarding/OnboardingWidget";

export function DashboardPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { data: status, isLoading: statusLoading, error: statusError } = useWorkspaceStatus();

    // Redirect to onboarding if no workspace found
    useEffect(() => {
        if (!statusLoading && status === null) {
            navigate("/onboarding");
        }
    }, [status, statusLoading, navigate]);

    // Fetch stats and events for the current workspace
    const { stats, isLoading: statsLoading } = useDashboardStats(status?.id);
    const { data: recentActivity, isLoading: activityLoading } = useEvents({
        pageSize: 5,
        workspaceId: status?.id,
    });

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

    // 1. Error State (Prevent Loop)
    if (statusError) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                    <IconAlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold font-heading text-brand-dark">
                        Unable to Load Workspace
                    </h3>
                    <p className="text-brand-gray-mid max-w-xs mx-auto text-sm">
                        There was an issue connecting to your workspace. Please try signing in
                        again.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        queryClient.clear();
                        navigate("/login");
                    }}
                    variant="outline"
                >
                    Return to Login
                </Button>
            </div>
        );
    }

    // 2. Loading State
    if (statusLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-brand-gray-mid font-heading">
                    Loading workspace...
                </div>
            </div>
        );
    }

    // 2. Onboarding Gate (Show ONLY widget if any service is missing OR not marked complete)
    // Account created is step 1, so we check the 3 integrations.
    const isFullyOnboarded =
        !!status?.onboardingCompletedAt ||
        (status?.hasJira && status?.hasGithub && status?.hasSlack);

    if (!isFullyOnboarded) {
        return (
            <div className="max-w-2xl mx-auto mt-20">
                <OnboardingWidget />
            </div>
        );
    }

    // 3. Full Dashboard (Only shown if onboarded)
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Demo Mode Banner */}
            <DemoBanner />

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold font-heading tracking-tight text-brand-dark">
                        Dashboard
                    </h1>
                    <p className="text-brand-gray-mid font-light">
                        Overview of your delivery assurance metrics.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-brand-accent-green animate-pulse"></div>
                    <span className="text-sm font-medium text-brand-accent-green">
                        Live Monitoring
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                            color: "text-brand-accent-blue",
                            bgColor: "bg-brand-accent-blue/10",
                            trend: "+12%",
                        },
                        {
                            title: "Pending Proofs",
                            value: stats.pendingProofs,
                            icon: IconClock,
                            color: "text-brand-accent-orange",
                            bgColor: "bg-brand-accent-orange/10",
                            trend: "+5%",
                        },
                        {
                            title: "Completed",
                            value: stats.completedProofs,
                            icon: IconCircleCheck,
                            color: "text-brand-accent-green",
                            bgColor: "bg-brand-accent-green/10",
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
                    ].map((stat, index) => {
                        const CardWrapper = ({ children }: { children: React.ReactNode }) => {
                            if (stat.title === "Pending Proofs" || stat.title === "Completed") {
                                return <Link to="/proofs">{children}</Link>;
                            }
                            return <>{children}</>;
                        };

                        return (
                            <CardWrapper key={stat.title}>
                                <Card
                                    className="bg-white border-brand-gray-light hover:border-brand-gray-mid/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-bold font-heading text-brand-gray-mid uppercase tracking-wider">
                                            {stat.title}
                                        </CardTitle>
                                        <div
                                            className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                                        >
                                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-black font-heading text-brand-dark">
                                            {stat.value}
                                        </div>
                                        <div className="flex items-center gap-1 mt-2">
                                            <IconTrendingUp className="h-3 w-3 text-brand-accent-green" />
                                            <p className="text-xs text-brand-gray-mid font-medium">
                                                <span className="text-brand-accent-green">
                                                    {stat.trend}
                                                </span>{" "}
                                                this week
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardWrapper>
                        );
                    })
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-white border-brand-gray-light shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-heading font-bold text-xl text-brand-dark">
                            Recent Activity
                        </CardTitle>
                        <CardDescription className="text-brand-gray-mid">
                            Latest events from your repositories.
                        </CardDescription>
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
                            <div className="text-center py-16">
                                <div className="h-16 w-16 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
                                    <IconActivity className="h-8 w-8 text-brand-gray-mid/50" />
                                </div>
                                <p className="text-lg font-medium text-brand-dark mb-1">
                                    No recent activity
                                </p>
                                <p className="text-sm text-brand-gray-mid">
                                    Activity will appear here once you start tracking work
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentActivity?.events?.map((event) => {
                                    const payload = event.payload as any;
                                    let icon = <IconActivity className="h-4 w-4 text-brand-dark" />;
                                    // Fix: Explicitly type title as string to avoid strict union type mismatch
                                    let title: string = event.eventType;
                                    let link: string | null = null;

                                    // ... rest of logic ...
                                    if (event.eventType === "handshake") {
                                        icon = (
                                            <IconBrandTrello className="h-4 w-4 text-brand-accent-blue" />
                                        );
                                        title = `Started ${payload.issueKey || "Task"} - ${payload.issueTitle || "Untitled"}`;
                                    } else if (event.eventType.includes("pr")) {
                                        icon = (
                                            <IconBrandGithub className="h-4 w-4 text-brand-dark" />
                                        );
                                        title = `${event.eventType.replace("pr_", "PR ")}: ${payload.prTitle || "Unknown PR"}`;
                                        link = payload.prUrl;
                                    } else if (event.eventType === "closure_approved") {
                                        icon = (
                                            <IconShieldCheck className="h-4 w-4 text-brand-accent-green" />
                                        );
                                        title = "Proof Packet Generated & Approved";
                                    }

                                    return (
                                        <div
                                            key={event.id}
                                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-brand-light/50 transition-colors group relative border border-transparent hover:border-brand-gray-light/50"
                                        >
                                            <div className="bg-brand-light p-3 rounded-xl border border-brand-gray-light/50">
                                                {icon}
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <p className="text-sm font-semibold text-brand-dark leading-none truncate pr-4">
                                                    {link ? (
                                                        <a
                                                            href={link}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="hover:text-brand-accent-blue transition-colors flex items-center gap-1"
                                                        >
                                                            {title}{" "}
                                                            <IconLink
                                                                size={12}
                                                                className="text-brand-gray-mid opacity-0 group-hover:opacity-100 transition-opacity"
                                                            />
                                                        </a>
                                                    ) : (
                                                        title
                                                    )}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-brand-gray-mid font-medium">
                                                        {formatDistanceToNow(
                                                            new Date(event.createdAt),
                                                            {
                                                                addSuffix: true,
                                                            },
                                                        )}
                                                    </p>
                                                    {event.taskId && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] h-5 px-2 text-brand-gray-mid border-brand-gray-mid/30 bg-brand-light/30"
                                                        >
                                                            {event.taskId}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-brand-dark text-brand-light border-brand-dark shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <CardHeader className="relative z-10">
                        <CardTitle className="font-heading font-bold text-xl text-brand-light">
                            Optimistic Closures
                        </CardTitle>
                        <CardDescription className="text-brand-gray-mid">
                            Scheduled for auto-finalization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-center py-16">
                            <div className="h-20 w-20 rounded-full bg-brand-light/5 flex items-center justify-center mx-auto mb-6 border border-brand-light/10">
                                <IconCircleCheck className="h-10 w-10 text-brand-accent-green" />
                            </div>
                            <p className="text-lg font-bold text-brand-light mb-2">All Clear</p>
                            <p className="text-sm text-brand-gray-mid font-light max-w-[200px] mx-auto">
                                No pending closures at this time. Great job!
                            </p>
                            <div className="mt-8">
                                <Badge className="bg-brand-accent-green/20 text-brand-accent-green hover:bg-brand-accent-green/30 border-0 px-4 py-1.5">
                                    System Healthy
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
