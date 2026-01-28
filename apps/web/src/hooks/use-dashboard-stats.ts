import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDashboardStats(workspaceId?: string) {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard-stats", workspaceId],
        queryFn: async () => {
            if (!workspaceId) return null;
            return api.events.stats(workspaceId);
        },
        enabled: !!workspaceId,
        retry: false, // Prevent infinite loops on API errors
    });

    return {
        stats: {
            activeTasks: data?.activeTasks || 0,
            pendingProofs: data?.pendingProofs || 0,
            completedProofs: data?.completedProofs || 0,
            vetoed: data?.vetoed || 0,
        },
        isLoading,
    };
}
