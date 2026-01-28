import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface WorkspaceStatus {
    id: string;
    name: string;
    hasSlack: boolean;
    hasGithub: boolean;
    hasJira: boolean;
    defaultPolicyTier: string;
}

export function useWorkspaceStatus() {
    return useQuery<WorkspaceStatus | null>({
        queryKey: ["workspace-status"],
        queryFn: async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) throw new Error("Not authenticated");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/workspaces/current`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                await supabase.auth.signOut();
                throw new Error("Session expired");
            }
            if (res.status === 404) return null;
            if (!res.ok) throw new Error("Failed to fetch workspace status");

            return res.json();
        },
        retry: false, // Don't retry auth errors
    });
}
