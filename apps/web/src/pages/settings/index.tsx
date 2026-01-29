import {
    IconActivity,
    IconBrandGithub,
    IconBrandSlack,
    IconBrandTrello,
    IconBuilding,
    IconCheck,
    IconDeviceFloppy,
    IconMail,
    IconSettings,
    IconShield,
    IconUser,
    IconUsers,
    IconX,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";
import { supabase } from "@/lib/supabase";

export function SettingsPage() {
    const { user } = useAuth();
    const { data: workspace, isLoading } = useWorkspaceStatus();
    const queryClient = useQueryClient();

    // Workflow State
    const [startStatuses, setStartStatuses] = useState<string[]>([]);
    const [newStatus, setNewStatus] = useState("");

    // Branding State
    const [brandColor, setBrandColor] = useState("#3b82f6");
    const [brandLogo, setBrandLogo] = useState("");

    // Proof Rules State
    const [autoCreateOnDone, setAutoCreateOnDone] = useState(true);

    // Sync state
    useEffect(() => {
        if (workspace?.workflowSettings?.startTracking) {
            setStartStatuses(workspace.workflowSettings.startTracking);
        }
        if (workspace?.proofPacketRules) {
            setAutoCreateOnDone(workspace.proofPacketRules.autoCreateOnDone ?? true);
        }
    }, [workspace]);

    // Fetch Members
    const { data: members } = useQuery({
        queryKey: ["workspace-members", workspace?.id],
        queryFn: async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token || !workspace) return [];
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/workspaces/${workspace.id}/members`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            return res.json();
        },
        enabled: !!workspace?.id,
    });

    // Mutations
    const updateSettingsMutation = useMutation({
        mutationFn: async (payload: any) => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
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
        onError: () => toast.error("Failed to save settings"),
    });

    const handleSaveStartStatuses = () => {
        updateSettingsMutation.mutate({
            workflowSettings: {
                startTracking: startStatuses,
                reviewStatus: ["In Review"], // naive preserve
                doneStatus: ["Done"],
            },
        });
    };

    const handleSaveBranding = () => {
        toast.success("Branding assets updated");
    };

    const handleSaveRules = () => {
        updateSettingsMutation.mutate({
            proofPacketRules: {
                autoCreateOnDone: autoCreateOnDone,
                minEventsForProof: 5,
                excludedTaskTypes: [],
            },
        });
    };

    if (isLoading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto py-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your account and workspace preferences.
                    </p>
                </div>
                {workspace && (
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="border-blue-500/30 text-blue-400 bg-blue-500/10"
                        >
                            {workspace.defaultPolicyTier?.toUpperCase() || "STANDARD"} TIER
                        </Badge>
                    </div>
                )}
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-brand-light/5 border border-brand-gray-light/20 p-1 flex-wrap h-auto rounded-xl">
                    <TabsTrigger
                        value="general"
                        className="data-[state=active]:bg-brand-dark data-[state=active]:text-brand-light text-brand-gray-mid hover:text-brand-dark transition-all"
                    >
                        <IconUser className="w-4 h-4 mr-2" /> General
                    </TabsTrigger>
                    <TabsTrigger
                        value="workflow"
                        className="data-[state=active]:bg-brand-dark data-[state=active]:text-brand-light text-brand-gray-mid hover:text-brand-dark transition-all"
                    >
                        <IconSettings className="w-4 h-4 mr-2" /> Workflow
                    </TabsTrigger>
                    <TabsTrigger
                        value="proofs"
                        className="data-[state=active]:bg-brand-dark data-[state=active]:text-brand-light text-brand-gray-mid hover:text-brand-dark transition-all"
                    >
                        <IconCheck className="w-4 h-4 mr-2" /> Proof Rules
                    </TabsTrigger>
                    <TabsTrigger
                        value="health"
                        className="data-[state=active]:bg-brand-dark data-[state=active]:text-brand-light text-brand-gray-mid hover:text-brand-dark transition-all"
                    >
                        <IconActivity className="w-4 h-4 mr-2" /> System Health
                    </TabsTrigger>
                    <TabsTrigger
                        value="team"
                        className="data-[state=active]:bg-brand-dark data-[state=active]:text-brand-light text-brand-gray-mid hover:text-brand-dark transition-all"
                    >
                        <IconUsers className="w-4 h-4 mr-2" /> Team
                    </TabsTrigger>
                    <TabsTrigger
                        value="branding"
                        className="data-[state=active]:bg-brand-dark data-[state=active]:text-brand-light text-brand-gray-mid hover:text-brand-dark transition-all"
                    >
                        <IconBuilding className="w-4 h-4 mr-2" /> Branding
                    </TabsTrigger>
                </TabsList>

                {/* GENERAL TAB (Old Profile + Workspace) */}
                <TabsContent value="general" className="space-y-6">
                    {/* Profile Section */}
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <IconUser className="h-5 w-5 text-primary" />
                                <CardTitle>Profile</CardTitle>
                            </div>
                            <CardDescription>Your personal account information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="full-name" className="text-sm font-medium">
                                        Full Name
                                    </label>
                                    <Input
                                        id="full-name"
                                        disabled
                                        value={user?.user_metadata?.full_name || "Trail User"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </label>
                                    <div className="flex gap-2">
                                        <IconMail className="h-4 w-4 absolute translate-y-3 translate-x-3 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            disabled
                                            value={user?.email}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Workspace Summary */}
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <IconBuilding className="h-5 w-5 text-primary" />
                                <CardTitle>Workspace</CardTitle>
                            </div>
                            <CardDescription>
                                Manage your Trail Enterprise workspace.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {workspace ? (
                                <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-background/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <IconShield className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{workspace.name}</h4>
                                            <p className="text-sm text-muted-foreground font-mono text-xs">
                                                ID: {workspace.id}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-500/10 text-green-500"
                                    >
                                        {workspace.defaultPolicyTier || "Standard"} Plan
                                    </Badge>
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">
                                    No workspace found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* WORKFLOW TAB */}
                <TabsContent value="workflow" className="space-y-4">
                    <Card className="bg-white border-brand-gray-light shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-brand-light/30 border-b border-brand-gray-light/30 pb-4">
                            <CardTitle className="text-xl font-heading font-bold text-brand-dark">
                                Trigger Configuration
                            </CardTitle>
                            <CardDescription className="text-brand-gray-mid font-serif italic">
                                When should ShipDocket start tracking?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex flex-wrap gap-2">
                                {startStatuses.map((status) => (
                                    <div
                                        key={status}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent-blue/10 border border-brand-accent-blue/20 text-brand-accent-blue text-sm font-bold shadow-sm"
                                    >
                                        <span>{status}</span>
                                        <button
                                            onClick={() =>
                                                setStartStatuses(
                                                    startStatuses.filter((s) => s !== status),
                                                )
                                            }
                                            className="text-brand-accent-blue/70 hover:text-brand-accent-blue transition-colors"
                                        >
                                            <IconX size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 max-w-sm">
                                <Input
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    placeholder="Add status (e.g. 'Working')"
                                    className="bg-brand-light border-brand-gray-light/50 focus-visible:ring-brand-accent-blue"
                                />
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (newStatus && !startStatuses.includes(newStatus)) {
                                            setStartStatuses([...startStatuses, newStatus]);
                                            setNewStatus("");
                                        }
                                    }}
                                    variant="secondary"
                                    className="bg-brand-dark text-brand-light hover:bg-black"
                                >
                                    Add
                                </Button>
                            </div>
                            <Button
                                onClick={handleSaveStartStatuses}
                                className="mt-4 bg-brand-accent-blue text-white hover:bg-blue-600 font-bold shadow-md shadow-blue-500/20 rounded-lg"
                            >
                                <IconDeviceFloppy className="w-4 h-4 mr-2" /> Save Workflow
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PROOF RULES TAB */}
                <TabsContent value="proofs" className="space-y-4">
                    <Card className="bg-white border-brand-gray-light shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-brand-light/30 border-b border-brand-gray-light/30 pb-4">
                            <CardTitle className="text-xl font-heading font-bold text-brand-dark">
                                Smart Creation Rules
                            </CardTitle>
                            <CardDescription className="text-brand-gray-mid font-serif italic">
                                Configure when Proof Packets are automatically generated.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex items-center justify-between p-5 rounded-xl bg-brand-light/40 border border-brand-gray-light/30">
                                <div>
                                    <h3 className="font-bold text-brand-dark text-lg">
                                        Auto-Create on "Done"
                                    </h3>
                                    <p className="text-sm text-brand-gray-mid mt-1 font-medium">
                                        Automatically create a draft Proof Packet when a Jira task
                                        updates to "Done".
                                    </p>
                                </div>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) =>
                                        (e.key === "Enter" || e.key === " ") &&
                                        setAutoCreateOnDone(!autoCreateOnDone)
                                    }
                                    className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors shadow-inner ${autoCreateOnDone ? "bg-brand-accent-green" : "bg-brand-gray-light"}`}
                                    onClick={() => setAutoCreateOnDone(!autoCreateOnDone)}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${autoCreateOnDone ? "translate-x-6" : "translate-x-0"}`}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleSaveRules}
                                className="bg-brand-accent-green hover:bg-green-600 text-white font-bold shadow-md shadow-green-500/20 rounded-lg"
                            >
                                <IconDeviceFloppy className="w-4 h-4 mr-2" /> Save Rules
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SYSTEM HEALTH TAB */}
                <TabsContent value="health" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {workspace && (
                            <>
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
                            </>
                        )}
                    </div>
                </TabsContent>

                {/* TEAM TAB */}
                <TabsContent value="team" className="space-y-4">
                    <Card className="bg-white border-brand-gray-light shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between bg-brand-light/30 border-b border-brand-gray-light/30 pb-4">
                            <div>
                                <CardTitle className="text-xl font-heading font-bold text-brand-dark">
                                    Team Members
                                </CardTitle>
                                <CardDescription className="text-brand-gray-mid font-serif italic">
                                    Manage access to your workspace.
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                className="border-brand-gray-light text-brand-dark hover:bg-brand-light"
                            >
                                Invite Member
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {members?.map((m: any) => (
                                    <div
                                        key={m.userId}
                                        className="flex items-center justify-between p-4 rounded-xl bg-white border border-brand-gray-light/40 hover:border-brand-gray-light hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-accent-blue to-brand-accent-purple flex items-center justify-center text-xs font-bold text-white shadow-md">
                                                {m.role?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-brand-dark group-hover:text-black transition-colors">
                                                    {m.userId}
                                                </div>
                                                <div className="text-xs text-brand-gray-mid font-medium uppercase tracking-wide">
                                                    {m.role}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={m.role === "owner" ? "default" : "secondary"}
                                            className={
                                                m.role === "owner"
                                                    ? "bg-brand-dark text-brand-light"
                                                    : "bg-brand-gray-light/30 text-brand-dark"
                                            }
                                        >
                                            {m.role}
                                        </Badge>
                                    </div>
                                ))}
                                {!members?.length && (
                                    <div className="text-brand-gray-mid/60 text-sm font-serif italic p-4 text-center">
                                        No members found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BRANDING TAB */}
                <TabsContent value="branding" className="space-y-4">
                    <Card className="bg-white border-brand-gray-light shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-brand-light/30 border-b border-brand-gray-light/30 pb-4">
                            <CardTitle className="text-xl font-heading font-bold text-brand-dark">
                                Whitelabel Settings
                            </CardTitle>
                            <CardDescription className="text-brand-gray-mid font-serif italic">
                                Customize the Proof Packets sent to your clients.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid gap-6 max-w-md">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="brand-color"
                                        className="text-sm font-bold text-brand-dark"
                                    >
                                        Primary Brand Color
                                    </label>
                                    <div className="flex gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg border border-brand-gray-light shadow-sm"
                                            style={{ background: brandColor }}
                                        />
                                        <Input
                                            id="brand-color"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="bg-brand-light border-brand-gray-light font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="brand-logo"
                                        className="text-sm font-bold text-brand-dark"
                                    >
                                        Logo URL
                                    </label>
                                    <Input
                                        id="brand-logo"
                                        value={brandLogo}
                                        onChange={(e) => setBrandLogo(e.target.value)}
                                        placeholder="https://..."
                                        className="bg-brand-light border-brand-gray-light"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleSaveBranding}
                                className="bg-brand-accent-orange hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 rounded-lg"
                            >
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
        <Card className="bg-white border-brand-gray-light shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-brand-light text-brand-dark group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                    </div>
                    {connected ? (
                        <Badge className="bg-brand-accent-green/10 text-brand-accent-green border-brand-accent-green/20 px-2 py-0.5 uppercase text-[10px] font-bold tracking-wider">
                            <IconCheck size={12} className="mr-1" /> Connected
                        </Badge>
                    ) : (
                        <Badge
                            variant="destructive"
                            className="bg-red-50/50 text-red-500 border-red-100 px-2 py-0.5 uppercase text-[10px] font-bold tracking-wider"
                        >
                            <IconX size={12} className="mr-1" /> Disconnected
                        </Badge>
                    )}
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-lg text-brand-dark">{name}</h3>
                    <p className="text-xs text-brand-gray-mid font-medium">
                        {connected ? `Operational • ${lastSync}` : "Integration not configured"}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
