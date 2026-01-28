import { useQuery } from "@tanstack/react-query";
import type { EventType } from "shared";
import { api } from "@/lib/api";

interface UseEventsOptions {
    workspaceId?: string;
    taskId?: string;
    eventType?: EventType;
    page?: number;
    pageSize?: number;
}

export function useEvents(options: UseEventsOptions = {}) {
    return useQuery({
        queryKey: ["events", options],
        queryFn: async () => {
            return api.events.list(options);
        },
        // Only fetch when workspaceId is available
        enabled: !!options.workspaceId,
        // Don't retry on errors to prevent infinite loops
        retry: false,
    });
}
