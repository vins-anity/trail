import {
    IconArrowLeft,
    IconCheck,
    IconClock,
    IconCopy,
    IconDownload,
    IconFileText,
    IconLink,
    IconLoader2,
    IconSparkles,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    useExportPdf,
    useGenerateSummary,
    useProofDetail,
    useProofEvents,
    useShareProof,
} from "@/hooks/use-proof-detail";
import { EventTimeline } from "@/components/proofs/EventTimeline";

export function ProofDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: proof, isLoading, error } = useProofDetail(id);
    const { data: eventsData } = useProofEvents(proof?.task?.key);

    const generateSummary = useGenerateSummary();
    const exportPdf = useExportPdf();
    const shareProof = useShareProof();

    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !proof) {
        return (
            <div className="space-y-4">
                <Link to="/proofs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <IconArrowLeft className="h-4 w-4" />
                    Back to Proofs
                </Link>
                <div className="p-4 rounded-md bg-destructive/10 text-destructive">
                    Proof packet not found.
                </div>
            </div>
        );
    }

    const handleGenerateSummary = async () => {
        if (!id) return;
        await generateSummary.mutateAsync({ id });
    };

    const handleExportPdf = async () => {
        if (!id) return;
        const result = await exportPdf.mutateAsync(id);
        setPdfUrl(result.url);
    };

    const handleShare = async () => {
        if (!id) return;
        const result = await shareProof.mutateAsync(id);
        setShareUrl(result.shareUrl);
        await navigator.clipboard.writeText(result.shareUrl);
    };

    const statusColors: Record<string, string> = {
        draft: "bg-yellow-500/10 text-yellow-500",
        pending: "bg-orange-500/10 text-orange-500",
        finalized: "bg-green-500/10 text-green-500",
        exported: "bg-blue-500/10 text-blue-500",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Link to="/proofs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
                        <IconArrowLeft className="h-4 w-4" />
                        Back to Proofs
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconFileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {proof.task.key}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Proof Packet • Created {new Date(proof.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
                <Badge className={statusColors[proof.status] || "bg-muted text-muted-foreground"}>
                    {proof.status.charAt(0).toUpperCase() + proof.status.slice(1)}
                </Badge>
            </div>

            <Separator className="bg-white/10" />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Summary Card */}
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconSparkles className="h-5 w-5 text-primary" />
                                    <CardTitle>AI Summary</CardTitle>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={handleGenerateSummary}
                                    disabled={generateSummary.isPending}
                                >
                                    {generateSummary.isPending ? (
                                        <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <IconSparkles className="h-4 w-4 mr-2" />
                                    )}
                                    {proof.aiSummary ? "Regenerate" : "Generate Summary"}
                                </Button>
                            </div>
                            <CardDescription>
                                Client-friendly summary powered by AI
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {proof.aiSummary ? (
                                <div className="space-y-3">
                                    <p className="text-foreground leading-relaxed">
                                        {proof.aiSummary}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    No summary generated yet. Click "Generate Summary" to create one.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Event Timeline */}
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <IconClock className="h-5 w-5 text-primary" />
                                <CardTitle>Event Timeline</CardTitle>
                            </div>
                            <CardDescription>
                                Hash-chained audit trail of all task events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {eventsData?.events && eventsData.events.length > 0 ? (
                                <EventTimeline events={eventsData.events} />
                            ) : (
                                <p className="text-muted-foreground italic text-center py-8">
                                    No events recorded for this task yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader>
                            <CardTitle className="text-base">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={handleExportPdf}
                                disabled={exportPdf.isPending}
                            >
                                {exportPdf.isPending ? (
                                    <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <IconDownload className="h-4 w-4 mr-2" />
                                )}
                                Export as PDF
                            </Button>
                            {pdfUrl && (
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline block"
                                >
                                    Download PDF →
                                </a>
                            )}

                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={handleShare}
                                disabled={shareProof.isPending}
                            >
                                {shareProof.isPending ? (
                                    <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : shareUrl ? (
                                    <IconCheck className="h-4 w-4 mr-2 text-green-500" />
                                ) : (
                                    <IconLink className="h-4 w-4 mr-2" />
                                )}
                                {shareUrl ? "Link Copied!" : "Share Link"}
                            </Button>
                            {shareUrl && (
                                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs">
                                    <span className="truncate flex-1">{shareUrl}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <IconCopy className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Details Card */}
                    <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardHeader>
                            <CardTitle className="text-base">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-medium capitalize">{proof.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Task ID</span>
                                <span className="font-mono text-xs">{proof.task.key}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created</span>
                                <span>{new Date(proof.createdAt).toLocaleString()}</span>
                            </div>
                            {proof.closure?.closedAt && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Closed</span>
                                    <span>{new Date(proof.closure.closedAt).toLocaleString()}</span>
                                </div>
                            )}
                            {proof.hashChainRoot && (
                                <div className="pt-2 border-t border-white/5">
                                    <span className="text-muted-foreground text-xs block mb-1">Hash Chain Root</span>
                                    <span className="font-mono text-xs break-all">{proof.hashChainRoot}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
