import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { EventType } from "shared";

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
            const res = await api.events.$get({
                query: {
                    workspaceId: options.workspaceId,
                    taskId: options.taskId,
                    eventType: options.eventType,
                    page: options.page?.toString(),
                    pageSize: options.pageSize?.toString(),
                },
            });
            if (!res.ok) {
                throw new Error("Failed to fetch events");
            }
            return res.json();
        },
    });
}
