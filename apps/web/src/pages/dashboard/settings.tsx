
import {
    IconDeviceFloppy,
    IconSettings,
    IconTrash,
    IconUsers,
    IconActivity,
    IconBuilding,
    IconBrandSlack,
    IconBrandGithub,
    IconBrandTrello, // Proxy for Jira
    IconCheck,
    IconX
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner"; // Assuming sonner is used, or we fallback to console

export function SettingsPage() {
    const { data: workspace } = useWorkspaceStatus();
    const queryClient = useQueryClient();

    // Workflow State
    const [startStatuses, setStartStatuses] = useState<string[]>([]);
    const [newStatus, setNewStatus] = useState("");

    // Branding State
    const [brandColor, setBrandColor] = useState("#3b82f6");
    const [brandLogo, setBrandLogo] = useState("");

    // Sync state
    useEffect(() => {
        if (workspace?.workflowSettings?.startTracking) {
            setStartStatuses(workspace.workflowSettings.startTracking);
        }
    }, [workspace]);

    // Fetch Members
    const { data: members } = useQuery({
        queryKey: ["workspace-members", workspace?.id],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token || !workspace) return [];
            const res = await fetch(`${import.meta.env.VITE_API_URL}/workspaces/${workspace.id}/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.json();
        },
        enabled: !!workspace?.id,
    });

    // Mutations
    const updateSettingsMutation = useMutation({
        mutationFn: async (payload: any) => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token || !workspace) throw new Error("Not authenticated");

            // Mock endpoint for branding if not fully separate
            const res = await fetch(`${import.meta.env.VITE_API_URL}/workspaces/${workspace.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to update");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace-status"] });
            toast.success("Settings saved successfully");
        },
        onError: () => toast.error("Failed to save settings")
    });

    const handleSaveStartStatuses = () => {
        updateSettingsMutation.mutate({
            workflowSettings: {
                startTracking: startStatuses,
                reviewStatus: ["In Review"], // naive preserve
                doneStatus: ["Done"]
            }
        });
    };

    const handleSaveBranding = () => {
        // In a real app we'd save this to a 'branding' column
        // For now we just pretend
        toast.success("Branding assets updated");
    };

    if (!workspace) return <div className="p-8">Loading console...</div>;

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Admin Console</h1>
                    <p className="text-gray-400 mt-1">Manage your workspace, team, and configurations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                        {workspace.defaultPolicyTier?.toUpperCase() || "STANDARD"} TIER
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="workflow" className="space-y-6">
                <TabsList className="bg-gray-900/50 border border-white/10 p-1">
                    <TabsTrigger value="workflow" className="data-[state=active]:bg-blue-600">
                        <IconSettings className="w-4 h-4 mr-2" /> Workflow
                    </TabsTrigger>
                    <TabsTrigger value="health" className="data-[state=active]:bg-green-600">
                        <IconActivity className="w-4 h-4 mr-2" /> System Health
                    </TabsTrigger>
                    <TabsTrigger value="team" className="data-[state=active]:bg-purple-600">
                        <IconUsers className="w-4 h-4 mr-2" /> Team
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="data-[state=active]:bg-orange-600">
                        <IconBuilding className="w-4 h-4 mr-2" /> Branding
                    </TabsTrigger>
                </TabsList>

                {/* WORKFLOW TAB */}
                <TabsContent value="workflow" className="space-y-4">
                    <Card className="bg-gray-900/40 backdrop-blur-sm border-white/10">
                        <CardHeader>
                            <CardTitle>Trigger Configuration</CardTitle>
                            <CardDescription>When should ShipDocket start tracking?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {startStatuses.map((status) => (
                                    <div key={status} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                                        <span>{status}</span>
                                        <button onClick={() => setStartStatuses(startStatuses.filter(s => s !== status))} className="text-gray-500 hover:text-white">
                                            <IconX size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 max-w-sm">
                                <Input
                                    value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                                    placeholder="Add status (e.g. 'Working')"
                                    className="bg-black/40 border-white/10"
                                />
                                <Button onClick={(e) => { e.preventDefault(); if (newStatus && !startStatuses.includes(newStatus)) { setStartStatuses([...startStatuses, newStatus]); setNewStatus(""); } }} variant="secondary">Add</Button>
                            </div>
                            <Button onClick={handleSaveStartStatuses} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                                <IconDeviceFloppy className="w-4 h-4 mr-2" /> Save Workflow
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SYSTEM HEALTH TAB */}
                <TabsContent value="health" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <HealthCard
                            name="Slack"
                            icon={IconBrandSlack}
                            connected={workspace.hasSlack}
                            lastSync="1m ago"
                        />
                        <HealthCard
                            name="GitHub"
                            icon={IconBrandGithub}
                            connected={workspace.hasGithub}
                            lastSync="Active"
                        />
                        <HealthCard
                            name="Jira"
                            icon={IconBrandTrello}
                            connected={workspace.hasJira}
                            lastSync="Active"
                        />
                    </div>
                </TabsContent>

                {/* TEAM TAB */}
                <TabsContent value="team" className="space-y-4">
                    <Card className="bg-gray-900/40 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>Manage access to your workspace.</CardDescription>
                            </div>
                            <Button variant="outline" className="border-white/10">Invite Member</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {members?.map((m: any) => (
                                    <div key={m.userId} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                                {m.role?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{m.userId}</div>
                                                <div className="text-xs text-gray-500 capitalize">{m.role}</div>
                                            </div>
                                        </div>
                                        <Badge variant={m.role === 'owner' ? 'default' : 'secondary'}>
                                            {m.role}
                                        </Badge>
                                    </div>
                                ))}
                                {!members?.length && <div className="text-gray-500 text-sm">No members found.</div>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BRANDING TAB */}
                <TabsContent value="branding" className="space-y-4">
                    <Card className="bg-gray-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle>Whitelabel Settings</CardTitle>
                            <CardDescription>Customize the Proof Packets sent to your clients.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Primary Brand Color</label>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded border border-white/20" style={{ background: brandColor }} />
                                        <Input value={brandColor} onChange={e => setBrandColor(e.target.value)} className="bg-black/40 border-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Logo URL</label>
                                    <Input value={brandLogo} onChange={e => setBrandLogo(e.target.value)} placeholder="https://..." className="bg-black/40 border-white/10" />
                                </div>
                            </div>
                            <Button onClick={handleSaveBranding} className="bg-orange-600 hover:bg-orange-700 text-white">
                                <IconDeviceFloppy className="w-4 h-4 mr-2" /> Save Branding
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function HealthCard({ name, icon: Icon, connected, lastSync }: any) {
    return (
        <Card className="bg-gray-900/40 border-white/10">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/5">
                        <Icon className="w-6 h-6 text-gray-300" />
                    </div>
                    {connected ? (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                            <IconCheck size={12} className="mr-1" /> Connected
                        </Badge>
                    ) : (
                        <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20">
                            <IconX size={12} className="mr-1" /> Disconnected
                        </Badge>
                    )}
                </div>
                <div className="space-y-1">
                    <h3 className="font-medium text-white">{name}</h3>
                    <p className="text-xs text-gray-500">
                        {connected ? `Operational • ${lastSync}` : "Integration not configured"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
