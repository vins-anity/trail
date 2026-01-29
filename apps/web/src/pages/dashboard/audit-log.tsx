import { IconAlertTriangle, IconLink, IconShieldCheck } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { supabase } from "@/lib/supabase";

export function AuditLogExplorer() {
    const { data: workspace } = useWorkspaceStatus();

    const { data: logs, isLoading } = useQuery({
        queryKey: ["audit-log", workspace?.id],
        queryFn: async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token || !workspace) throw new Error("Not authenticated");

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/workspaces/${workspace.id}/audit-log`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            return res.json();
        },
        enabled: !!workspace?.id,
    });

    if (!workspace)
        return <div className="p-8 text-brand-gray-mid font-heading">Loading audit chain...</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black font-heading tracking-tight text-brand-dark flex items-center gap-3">
                        <IconShieldCheck className="text-brand-accent-green h-8 w-8" />
                        Audit Log Explorer
                    </h1>
                    <p className="text-brand-gray-mid mt-1 font-serif italic text-lg">
                        Cryptographically verified timeline of all workspace events.
                    </p>
                </div>
                <div className="text-right">
                    <Badge
                        variant="outline"
                        className="text-brand-accent-green border-brand-accent-green/30 bg-brand-accent-green/5 px-4 py-1.5 rounded-full font-bold shadow-sm"
                    >
                        Integrity Verified
                    </Badge>
                </div>
            </div>

            <div className="relative border-l-2 border-brand-gray-light/50 ml-6 space-y-8 py-4">
                {isLoading ? (
                    <div className="pl-8 text-brand-gray-mid font-medium">Loading chain...</div>
                ) : (
                    logs?.map((log: any, index: number) => (
                        <div key={log.id} className="relative pl-10 group">
                            {/* Timeline Node */}
                            <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-brand-light border-4 border-brand-accent-blue group-hover:scale-125 group-hover:border-brand-accent-orange transition-all duration-300 shadow-sm" />

                            <Card className="bg-white border-brand-gray-light hover:border-brand-accent-blue/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
                                <CardHeader className="py-5 px-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-bold font-heading text-brand-dark flex items-center gap-3">
                                                {log.eventType}
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs font-semibold bg-brand-light text-brand-gray-mid border-brand-gray-mid/10"
                                                >
                                                    {log.triggerSource}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="text-brand-gray-mid font-medium">
                                                {formatDistanceToNow(new Date(log.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </CardDescription>
                                        </div>
                                        <div className="text-xs font-mono text-brand-gray-mid text-right space-y-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            <div
                                                className="flex items-center gap-2 justify-end text-brand-dark"
                                                title="Current Hash"
                                            >
                                                <IconLink
                                                    size={12}
                                                    className="text-brand-accent-blue"
                                                />
                                                <span className="bg-brand-light px-1.5 py-0.5 rounded border border-brand-gray-light/50">
                                                    {log.eventHash.substring(0, 16)}...
                                                </span>
                                            </div>
                                            {log.prevHash && (
                                                <div
                                                    className="flex items-center gap-2 justify-end"
                                                    title="Previous Hash"
                                                >
                                                    <IconLink
                                                        size={12}
                                                        className="text-brand-gray-mid"
                                                    />
                                                    <span className="text-brand-gray-mid/70">
                                                        {log.prevHash.substring(0, 16)}...
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="py-0 px-0">
                                    <div className="bg-brand-dark/5 p-4 mx-6 mb-6 rounded-lg border border-brand-dark/5 font-mono text-xs text-brand-dark overflow-x-auto">
                                        <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
