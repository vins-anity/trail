
import { IconShieldCheck, IconLink, IconAlertTriangle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AuditLogExplorer() {
    const { data: workspace } = useWorkspaceStatus();

    const { data: logs, isLoading } = useQuery({
        queryKey: ["audit-log", workspace?.id],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token || !workspace) throw new Error("Not authenticated");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/workspaces/${workspace.id}/audit-log`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.json();
        },
        enabled: !!workspace?.id,
    });

    if (!workspace) return <div>Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <IconShieldCheck className="text-green-500" />
                        Audit Log Explorer
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Cryptographically verified timeline of all workspace events.
                    </p>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
                        Integrity Verified
                    </Badge>
                </div>
            </div>

            <div className="relative border-l-2 border-white/10 ml-4 space-y-8">
                {isLoading ? (
                    <div className="pl-8 text-gray-500">Loading chain...</div>
                ) : logs?.map((log: any, index: number) => (
                    <div key={log.id} className="relative pl-8 group">
                        {/* Timeline Node */}
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-gray-900 border-2 border-blue-500 group-hover:scale-125 transition-transform" />

                        <Card className="bg-gray-900/40 backdrop-blur-sm border-white/10 hover:border-blue-500/30 transition-colors">
                            <CardHeader className="py-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {log.eventType}
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {log.triggerSource}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </CardDescription>
                                    </div>
                                    <div className="text-xs font-mono text-gray-500 text-right space-y-1">
                                        <div className="flex items-center gap-1 justify-end" title="Current Hash">
                                            <IconLink size={12} />
                                            {log.eventHash.substring(0, 16)}...
                                        </div>
                                        {log.prevHash && (
                                            <div className="flex items-center gap-1 justify-end text-gray-700" title="Previous Hash">
                                                <IconLink size={12} />
                                                {log.prevHash.substring(0, 16)}...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-2 pb-4">
                                <div className="bg-black/50 rounded p-3 font-mono text-xs text-blue-200/80 overflow-x-auto">
                                    {JSON.stringify(log.payload, null, 2)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
