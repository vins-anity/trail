import {
    IconArrowLeft,
    IconBrandGithub,
    IconBrandGoogle,
    IconBuilding,
    IconCalendar,
    IconCheck,
    IconClock,
    IconDownload,
    IconFileText,
    IconHash,
    IconLoader2,
    IconShieldCheck,
    IconSparkles,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SharedProof {
    id: string;
    taskId: string;
    status: string;
    aiSummary: string | null;
    aiSummaryModel: string | null;
    hashChainRoot: string | null;
    closedAt: string | null;
    createdAt: string;
    task: {
        key: string;
        summary: string;
    };
    events: Array<{
        id: string;
        eventType: string;
        createdAt: string;
    }>;
    workspace: {
        name: string;
        workflowSettings?: {
            teamType?: string;
            branding?: {
                brandColor?: string;
                brandLogo?: string;
            };
            audience?: string;
        };
    };
}

export function SharePage() {
    const { token } = useParams<{ token: string }>();

    const {
        data: proof,
        isLoading,
        error,
    } = useQuery<SharedProof>({
        queryKey: ["shared-proof", token],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/proofs/share/${token}`);
            if (!res.ok) {
                throw new Error("Proof not found or expired");
            }
            return res.json();
        },
        enabled: !!token,
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <IconLoader2 className="h-8 w-8 animate-spin text-brand-dark" />
                    <p className="text-brand-gray-mid font-medium">Verifying proof packet...</p>
                </div>
            </div>
        );
    }

    if (error || !proof) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-sans">
                <Card className="max-w-md w-full bg-white shadow-xl border-brand-gray-light rounded-2xl overflow-hidden">
                    <CardContent className="pt-10 pb-8 text-center px-8">
                        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                            <IconFileText className="h-8 w-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black font-heading text-brand-dark mb-3">
                            Proof Not Found
                        </h2>
                        <p className="text-brand-gray-mid mb-8 leading-relaxed">
                            This proof packet link may have expired or is invalid. Please contact
                            the sender for a new link.
                        </p>
                        <Link to="/">
                            <Button
                                variant="outline"
                                className="rounded-xl border-brand-gray-light hover:bg-brand-light hover:text-brand-dark transition-all"
                            >
                                <IconArrowLeft className="h-4 w-4 mr-2" />
                                Return Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        draft: "bg-brand-gray-light text-brand-gray-mid border-brand-gray-mid/20",
        pending: "bg-brand-accent-orange/10 text-brand-accent-orange border-brand-accent-orange/20",
        finalized: "bg-brand-accent-green/10 text-brand-accent-green border-brand-accent-green/20",
        exported: "bg-brand-accent-blue/10 text-brand-accent-blue border-brand-accent-blue/20",
    };

    const eventIcons: Record<string, React.ReactNode> = {
        handshake: <IconBuilding className="h-4 w-4" />,
        pr_opened: <IconBrandGithub className="h-4 w-4" />,
        pr_merged: <IconCheck className="h-4 w-4" />,
        pr_approved: <IconCheck className="h-4 w-4" />,
        ci_passed: <IconCheck className="h-4 w-4" />,
        ci_failed: <IconCheck className="h-4 w-4" />,
        jira_status_changed: <IconFileText className="h-4 w-4" />,
        closure_approved: <IconShieldCheck className="h-4 w-4" />,
    };

    return (
        <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-accent-blue/20">
            {/* Header */}
            <header
                className="border-b border-brand-gray-light bg-white/80 backdrop-blur-md sticky top-0 z-10 transition-all duration-300"
                style={
                    {
                        "--brand-primary":
                            proof.workspace?.workflowSettings?.branding?.brandColor || "#3b82f6",
                    } as React.CSSProperties
                }
            >
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {proof.workspace?.workflowSettings?.branding?.brandLogo ? (
                            <img
                                src={proof.workspace.workflowSettings.branding.brandLogo}
                                alt={proof.workspace.name}
                                className="h-10 w-10 rounded-xl object-contain bg-white shadow-sm border border-brand-gray-light/20"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-xl bg-[var(--brand-primary)] flex items-center justify-center shadow-lg shadow-brand-dark/20 text-white">
                                <IconShieldCheck className="h-5 w-5" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-black font-heading text-brand-dark tracking-tight">
                                {proof.workspace?.workflowSettings?.audience === "clients"
                                    ? "Client Portal"
                                    : "Proof Packet"}
                            </h1>
                            <p className="text-xs text-brand-gray-mid font-medium flex items-center gap-1">
                                Genereted by{" "}
                                <span className="text-brand-dark font-bold">
                                    {proof.workspace?.name || "ShipDocket"}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Badge
                        className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs shadow-sm border ${statusColors[proof.status] || "bg-brand-light text-brand-gray-mid border-brand-gray-mid/10"}`}
                    >
                        {proof.status}
                    </Badge>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 animate-fade-in-up">
                {/* Task Info */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent-blue/10 text-brand-accent-blue text-xs font-bold uppercase tracking-widest mb-2 border border-brand-accent-blue/20">
                                <IconHash className="h-3 w-3" />
                                {proof.task?.key || proof.taskId}
                            </div>
                            <h2 className="text-4xl font-black font-heading text-brand-dark leading-tight">
                                {proof.task?.summary || "Proof Packet Details"}
                            </h2>
                            <div className="flex items-center gap-4 text-brand-gray-mid text-sm font-medium">
                                <span className="flex items-center gap-1.5">
                                    <IconCalendar className="h-4 w-4" />
                                    Created{" "}
                                    {new Date(proof.createdAt).toLocaleDateString(undefined, {
                                        dateStyle: "long",
                                    })}
                                </span>
                                {proof.closedAt && (
                                    <span className="flex items-center gap-1.5 text-brand-accent-green">
                                        <IconCheck className="h-4 w-4" />
                                        Closed{" "}
                                        {new Date(proof.closedAt).toLocaleDateString(undefined, {
                                            dateStyle: "long",
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* AI Summary */}
                        {proof.aiSummary && (
                            <Card className="bg-white border-brand-gray-light shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                                <CardHeader className="bg-gradient-to-r from-brand-light to-white border-b border-brand-gray-light/30 py-5">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold font-heading text-brand-dark">
                                        <IconSparkles className="h-5 w-5 text-brand-accent-purple" />
                                        AI Executive Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-brand-dark leading-relaxed text-lg font-serif">
                                        {proof.aiSummary}
                                    </p>
                                    {proof.aiSummaryModel && (
                                        <div className="mt-6 flex justify-end">
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] text-brand-gray-mid border-brand-gray-mid/20 bg-brand-light px-2 py-0.5"
                                            >
                                                Generated by {proof.aiSummaryModel}
                                            </Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Event Timeline */}
                        <Card className="bg-white border-brand-gray-light shadow-sm rounded-2xl overflow-hidden h-fit">
                            <CardHeader className="py-5 border-b border-brand-gray-light/30">
                                <CardTitle className="flex items-center gap-2 text-base font-bold font-heading text-brand-dark">
                                    <IconClock className="h-5 w-5 text-brand-gray-mid" />
                                    Activity Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-brand-gray-light/30">
                                    {proof.events && proof.events.length > 0 ? (
                                        proof.events.map((event) => (
                                            <div
                                                key={event.id}
                                                className="flex items-start gap-4 p-4 hover:bg-brand-light/30 transition-colors"
                                            >
                                                <div className="mt-1 p-1.5 rounded-lg bg-brand-light text-brand-dark shadow-sm border border-brand-gray-light/50">
                                                    {eventIcons[event.eventType] || (
                                                        <IconFileText className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-brand-dark capitalize leading-tight">
                                                        {event.eventType.replace(/_/g, " ")}
                                                    </p>
                                                    <p className="text-xs text-brand-gray-mid font-medium">
                                                        {new Date(event.createdAt).toLocaleString(
                                                            undefined,
                                                            {
                                                                dateStyle: "medium",
                                                                timeStyle: "short",
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-brand-gray-mid italic text-sm">
                                            No events recorded.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hash Verification */}
                        {proof.hashChainRoot && (
                            <Card className="bg-brand-accent-green/5 border-brand-accent-green/20 overflow-hidden shadow-none">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-full shadow-sm text-brand-accent-green">
                                            <IconShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-accent-green font-heading">
                                                Hash Chain Verified
                                            </p>
                                            <p className="text-xs text-brand-accent-green/80 mt-1 mb-3 leading-snug">
                                                This packet utilizes a cryptographic hash chain to
                                                ensure event integrity.
                                            </p>
                                            <div className="bg-white/50 p-2 rounded border border-brand-accent-green/20">
                                                <p className="text-[10px] font-mono text-brand-accent-green/70 break-all leading-tight">
                                                    {proof.hashChainRoot}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <Separator className="bg-brand-gray-light/50 my-12" />

                {/* Footer */}
                <div className="text-center text-sm text-brand-gray-mid pb-8">
                    <p className="font-serif italic text-lg">
                        This is a tamper-evident proof packet generated by ShipDocket.
                    </p>
                    <p className="mt-4">
                        <a
                            href="https://shipdocket.dev"
                            className="inline-flex items-center gap-1 text-brand-dark font-bold hover:text-brand-accent-blue transition-colors group"
                        >
                            Powered by ShipDocket.dev
                            <IconArrowLeft className="h-3 w-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}
