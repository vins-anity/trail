import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ProofStatus } from "shared";

interface UseProofPacketsOptions {
    workspaceId?: string;
    status?: ProofStatus;
    page?: number;
    pageSize?: number;
}

export function useProofPackets(options: UseProofPacketsOptions = {}) {
    return useQuery({
        queryKey: ["proofs", options],
        queryFn: async () => {
            const res = await api.proofs.$get({
                query: {
                    workspaceId: options.workspaceId,
                    status: options.status,
                    page: options.page?.toString(),
                    pageSize: options.pageSize?.toString(),
                },
            });
            if (!res.ok) {
                throw new Error("Failed to fetch proofs");
            }
            return res.json();
        },
    });
}
