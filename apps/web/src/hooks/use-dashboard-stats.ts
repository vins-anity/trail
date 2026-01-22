import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/events/stats`);
            if (!res.ok) throw new Error("Failed to fetch stats");
            return res.json();
        },
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
