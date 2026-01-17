import { useProofPackets } from "./use-proofs";
import { useEvents } from "./use-events";

export function useDashboardStats() {
    // 1. Pending Proofs (Status: pending)
    const { data: pendingProofsData, isLoading: isLoadingPending } = useProofPackets({
        status: "pending",
        pageSize: 1,
    });

    // 2. Completed Proofs (Status: exported)
    const { data: completedProofsData, isLoading: isLoadingCompleted } = useProofPackets({
        status: "exported",
        pageSize: 1,
    });

    // 3. Vetoed Events (Event Type: closure_vetoed)
    const { data: vetoedData, isLoading: isLoadingVetoed } = useEvents({
        eventType: "closure_vetoed",
        pageSize: 1,
    });

    // Mock Active Tasks for now (random number or derived)
    const activeTasks = 12;

    const isLoading = isLoadingPending || isLoadingCompleted || isLoadingVetoed;

    return {
        stats: {
            activeTasks,
            pendingProofs: pendingProofsData?.total || 0,
            completedProofs: completedProofsData?.total || 0,
            vetoed: vetoedData?.total || 0,
        },
        isLoading,
    };
}
