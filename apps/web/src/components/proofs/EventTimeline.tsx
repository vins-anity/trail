import {
    IconActivity,
    IconAlertCircle,
    IconCheck,
    IconGitMerge,
    IconGitPullRequest,
    IconHandStop,
    IconPlayerPlay,
    IconShieldCheck,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import type { Event } from "shared";
import { cn } from "@/lib/utils";

interface EventTimelineProps {
    events: Event[];
}

const eventConfig: Record<string, { icon: typeof IconActivity; color: string; label: string }> = {
    handshake: {
        icon: IconPlayerPlay,
        color: "text-blue-500 bg-blue-500/10",
        label: "Task Started",
    },
    handshake_rejected: {
        icon: IconHandStop,
        color: "text-red-500 bg-red-500/10",
        label: "Handshake Rejected",
    },
    pr_opened: {
        icon: IconGitPullRequest,
        color: "text-purple-500 bg-purple-500/10",
        label: "PR Opened",
    },
    pr_merged: {
        icon: IconGitMerge,
        color: "text-green-500 bg-green-500/10",
        label: "PR Merged",
    },
    pr_approved: {
        icon: IconCheck,
        color: "text-emerald-500 bg-emerald-500/10",
        label: "PR Approved",
    },
    ci_passed: {
        icon: IconShieldCheck,
        color: "text-green-500 bg-green-500/10",
        label: "CI Passed",
    },
    ci_failed: {
        icon: IconAlertCircle,
        color: "text-red-500 bg-red-500/10",
        label: "CI Failed",
    },
    closure_proposed: {
        icon: IconActivity,
        color: "text-orange-500 bg-orange-500/10",
        label: "Closure Proposed",
    },
    closure_vetoed: {
        icon: IconHandStop,
        color: "text-red-500 bg-red-500/10",
        label: "Closure Vetoed",
    },
    closure_finalized: {
        icon: IconCheck,
        color: "text-green-500 bg-green-500/10",
        label: "Task Closed",
    },
};

const defaultConfig = {
    icon: IconActivity,
    color: "text-muted-foreground bg-muted",
    label: "Event",
};

export function EventTimeline({ events }: EventTimelineProps) {
    // Sort events by creation date (oldest first for timeline)
    const sortedEvents = [...events].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return (
        <div className="space-y-0">
            {sortedEvents.map((event, index) => {
                const config = eventConfig[event.eventType] || defaultConfig;
                const Icon = config.icon;
                const isLast = index === sortedEvents.length - 1;

                return (
                    <div key={event.id} className="relative flex gap-4">
                        {/* Timeline connector */}
                        {!isLast && (
                            <div className="absolute left-[18px] top-10 w-0.5 h-[calc(100%-16px)] bg-border/50" />
                        )}

                        {/* Icon */}
                        <div
                            className={cn(
                                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                                config.color
                            )}
                        >
                            <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-sm">
                                        {config.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(event.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>

                                {/* Hash indicator */}
                                {event.eventHash && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <IconShieldCheck className="h-3 w-3 text-green-500" />
                                        <span className="font-mono">
                                            {event.eventHash.slice(0, 8)}...
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Additional details */}
                            {event.triggerSource && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    via {event.triggerSource.replace("_", " ")}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
