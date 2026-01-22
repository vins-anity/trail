import { useQuery } from "@tanstack/react-query";

export interface WorkspaceStatus {
    id: string;
    name: string;
    hasSlack: boolean;
    hasGithub: boolean;
    hasJira: boolean;
}

export function useWorkspaceStatus() {
    return useQuery<WorkspaceStatus>({
        queryKey: ["workspace-status"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/workspaces/current`);
            if (!res.ok) throw new Error("Failed to fetch workspace status");
            return res.json();
        },
    });
}
