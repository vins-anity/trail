import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

/**
 * Hook to fetch a single proof packet by ID
 */
export function useProofDetail(id: string | undefined) {
    return useQuery({
        queryKey: ["proof", id],
        queryFn: async () => {
            if (!id) throw new Error("Proof ID is required");
            return api.proofs.get(id);
        },
        enabled: Boolean(id),
    });
}

/**
 * Hook to fetch events for a specific task
 */
export function useProofEvents(taskId: string | undefined) {
    return useQuery({
        queryKey: ["proof-events", taskId],
        queryFn: async () => {
            if (!taskId) throw new Error("Task ID is required");
            return api.events.getByTask(taskId);
        },
        enabled: Boolean(taskId),
    });
}

/**
 * Hook to generate AI summary for a proof packet
 */
export function useGenerateSummary() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            options,
        }: {
            id: string;
            options?: { includeCommits?: boolean; tone?: string };
        }) => {
            return api.proofs.summarize(id, options);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["proof", variables.id] });
        },
    });
}

/**
 * Hook to export proof packet as PDF
 */
export function useExportPdf() {
    return useMutation({
        mutationFn: async (id: string) => {
            return api.proofs.exportPdf(id);
        },
    });
}

/**
 * Hook to share proof packet
 */
export function useShareProof() {
    return useMutation({
        mutationFn: async (id: string) => {
            return api.proofs.share(id);
        },
    });
}
