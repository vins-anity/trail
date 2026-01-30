import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Sanitize API_URL to remove trailing slash if present
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = RAW_API_URL.replace(/\/$/, "");

export interface WorkspaceStatus {
    id: string;
    name: string;
    hasSlack: boolean;
    hasGithub: boolean;
    hasJira: boolean;
    defaultPolicyTier: string;
    workflowSettings?: {
        startTracking: string[];
        reviewStatus: string[];
        doneStatus: string[];
        teamType?: string;
        stack?: string[];
        culture?: string;
        audience?: string;
        branding?: {
            brandColor?: string;
            brandLogo?: string;
        };
    };
    proofPacketRules?: {
        autoCreateOnDone: boolean;
        minEventsForProof: number;
        excludedTaskTypes: string[];
        enableClientPortal?: boolean;
    };
    onboardingCompletedAt?: string;
}

export function useWorkspaceStatus(workspaceId?: string | null) {
    return useQuery<WorkspaceStatus | null>({
        queryKey: ["workspace-status", workspaceId],
        queryFn: async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) throw new Error("Not authenticated");

            const url = new URL(`${API_URL}/workspaces/current`);
            if (workspaceId) url.searchParams.set("workspaceId", workspaceId);

            const res = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                throw new Error("Session expired");
            }
            if (res.status === 404) return null;
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to fetch workspace status");
            }

            const data = await res.json();
            return data;
        },
        retry: false, // Don't retry auth errors
    });
}
