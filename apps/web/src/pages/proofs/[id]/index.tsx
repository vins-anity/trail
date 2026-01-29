import {
    IconArrowLeft,
    IconCheck,
    IconClock,
    IconCopy,
    IconDownload,
    IconFileText,
    IconLink,
    IconLoader2,
    IconShieldCheck,
    IconSparkles,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EventTimeline } from "@/components/proofs/EventTimeline";
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
                <IconLoader2 className="h-8 w-8 animate-spin text-brand-gray-mid" />
            </div>
        );
    }

    if (error || !proof) {
        return (
            <div className="space-y-4 max-w-7xl mx-auto py-8">
                <Link
                    to="/proofs"
                    className="flex items-center gap-2 text-brand-gray-mid hover:text-brand-dark transition-colors"
                >
                    <IconArrowLeft className="h-4 w-4" />
                    Back to Proofs
                </Link>
                <div className="p-6 rounded-xl bg-red-50 border border-red-100 text-red-600 font-medium">
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
        draft: "bg-brand-gray-light text-brand-gray-mid border-brand-gray-mid/20",
        pending: "bg-brand-accent-orange/10 text-brand-accent-orange border-brand-accent-orange/20",
        finalized: "bg-brand-accent-green/10 text-brand-accent-green border-brand-accent-green/20",
        exported: "bg-brand-accent-blue/10 text-brand-accent-blue border-brand-accent-blue/20",
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto py-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Link
                        to="/proofs"
                        className="flex items-center gap-2 text-sm text-brand-gray-mid hover:text-brand-dark mb-4 transition-colors font-medium"
                    >
                        <IconArrowLeft className="h-4 w-4" />
                        Back to Proofs
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-brand-light flex items-center justify-center shadow-sm border border-brand-gray-light/50">
                            <IconFileText className="h-7 w-7 text-brand-accent-blue" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black font-heading tracking-tight text-brand-dark">
                                {proof.task.key}
                            </h1>
                            <p className="text-brand-gray-mid font-medium flex items-center gap-2">
                                Proof Packet
                                <span className="w-1 h-1 rounded-full bg-brand-gray-mid/30" />
                                Created{" "}
                                {new Date(proof.createdAt).toLocaleDateString(undefined, {
                                    dateStyle: "long",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
                <Badge
                    className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-sm border ${statusColors[proof.status] || "bg-brand-light text-brand-gray-mid border-brand-gray-mid/10"}`}
                >
                    {proof.status.charAt(0).toUpperCase() + proof.status.slice(1)}
                </Badge>
            </div>

            <Separator className="bg-brand-gray-light/50" />

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* AI Summary Card */}
                    <Card className="bg-white border-brand-gray-light shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-brand-light to-white border-b border-brand-gray-light/30 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-white shadow-sm border border-brand-gray-light/50">
                                        <IconSparkles className="h-5 w-5 text-brand-accent-purple" />
                                    </div>
                                    <div>
                                        <CardTitle className="font-heading font-bold text-lg text-brand-dark">
                                            AI Summary
                                        </CardTitle>
                                        <CardDescription className="text-brand-gray-mid">
                                            Client-friendly overview
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleGenerateSummary}
                                    disabled={generateSummary.isPending}
                                    className="text-brand-accent-purple hover:text-brand-dark hover:bg-brand-accent-purple/10"
                                >
                                    {generateSummary.isPending ? (
                                        <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <IconSparkles className="h-4 w-4 mr-2" />
                                    )}
                                    {proof.aiSummary ? "Regenerate" : "Generate"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            {proof.aiSummary ? (
                                <div className="space-y-6">
                                    <p className="text-brand-dark leading-relaxed text-lg font-serif">
                                        {proof.aiSummary}
                                    </p>
                                    {proof.aiSummaryModel && (
                                        <div className="flex justify-end">
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] text-brand-gray-mid border-brand-gray-mid/20 bg-brand-light px-2 py-0.5"
                                            >
                                                Generated by {proof.aiSummaryModel}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-brand-light/30 rounded-xl border border-dashed border-brand-gray-light/50">
                                    <IconSparkles className="h-10 w-10 text-brand-gray-mid/30 mx-auto mb-3" />
                                    <p className="text-brand-gray-mid italic">
                                        No summary generated yet. Click "Generate" to create one.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Event Timeline */}
                    <Card className="bg-white border-brand-gray-light shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <CardHeader className="py-6 border-b border-brand-gray-light/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-brand-light text-brand-dark">
                                    <IconClock className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="font-heading font-bold text-lg text-brand-dark">
                                        Event Timeline
                                    </CardTitle>
                                    <CardDescription className="text-brand-gray-mid">
                                        Hash-chained audit trail of all task events
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {eventsData?.events && eventsData.events.length > 0 ? (
                                <EventTimeline events={eventsData.events} />
                            ) : (
                                <p className="text-brand-gray-mid italic text-center py-12">
                                    No events recorded for this task yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <Card className="bg-white border-brand-gray-light shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="py-5 bg-brand-light/30 border-b border-brand-gray-light/30">
                            <CardTitle className="font-heading font-bold text-base text-brand-dark">
                                Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start h-12 text-base font-medium border-brand-gray-light/50 hover:bg-brand-light hover:text-brand-dark transition-all rounded-xl"
                                onClick={handleExportPdf}
                                disabled={exportPdf.isPending}
                            >
                                {exportPdf.isPending ? (
                                    <IconLoader2 className="h-5 w-5 animate-spin mr-3 text-brand-gray-mid" />
                                ) : (
                                    <IconDownload className="h-5 w-5 mr-3 text-brand-gray-mid" />
                                )}
                                Export as PDF
                            </Button>
                            {pdfUrl && (
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-brand-accent-blue hover:text-brand-dark hover:underline block text-center font-medium"
                                >
                                    Download PDF →
                                </a>
                            )}

                            <Button
                                variant="outline"
                                className={`w-full justify-start h-12 text-base font-medium border-brand-gray-light/50 hover:bg-brand-light hover:text-brand-dark transition-all rounded-xl ${shareUrl ? "bg-brand-accent-green/10 border-brand-accent-green/30 text-brand-accent-green hover:bg-brand-accent-green/20" : ""}`}
                                onClick={handleShare}
                                disabled={shareProof.isPending}
                            >
                                {shareProof.isPending ? (
                                    <IconLoader2 className="h-5 w-5 animate-spin mr-3 text-brand-gray-mid" />
                                ) : shareUrl ? (
                                    <IconCheck className="h-5 w-5 mr-3" />
                                ) : (
                                    <IconLink className="h-5 w-5 mr-3 text-brand-gray-mid" />
                                )}
                                {shareUrl ? "Link Copied!" : "Share Link"}
                            </Button>
                            {shareUrl && (
                                <div className="flex items-center gap-2 p-3 bg-brand-light rounded-lg text-xs font-mono text-brand-gray-mid border border-brand-gray-light/50">
                                    <span className="truncate flex-1">{shareUrl}</span>
                                    <button
                                        type="button"
                                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                                        className="text-brand-dark hover:bg-brand-gray-light/50 p-1 rounded transition-colors"
                                    >
                                        <IconCopy className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Details Card */}
                    <Card className="bg-white border-brand-gray-light shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="py-5 bg-brand-light/30 border-b border-brand-gray-light/30">
                            <CardTitle className="font-heading font-bold text-base text-brand-dark">
                                Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-brand-gray-light/20 last:border-0">
                                <span className="text-brand-gray-mid font-medium">Status</span>
                                <Badge
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[proof.status]} bg-transparent border-0 shadow-none p-0`}
                                >
                                    {proof.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-brand-gray-light/20 last:border-0">
                                <span className="text-brand-gray-mid font-medium">Task ID</span>
                                <span className="font-mono text-xs bg-brand-light px-2 py-1 rounded text-brand-dark border border-brand-gray-light/50">
                                    {proof.task.key}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-brand-gray-light/20 last:border-0">
                                <span className="text-brand-gray-mid font-medium">Created</span>
                                <span className="text-brand-dark font-medium">
                                    {new Date(proof.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            {proof.closure?.closedAt && (
                                <div className="flex justify-between items-center py-2 border-b border-brand-gray-light/20 last:border-0">
                                    <span className="text-brand-gray-mid font-medium">Closed</span>
                                    <span className="text-brand-dark font-medium">
                                        {new Date(proof.closure.closedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                            {proof.hashChainRoot && (
                                <div className="pt-4 mt-2 space-y-3">
                                    <div className="flex items-center gap-2 text-brand-accent-green">
                                        <IconShieldCheck className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Hash Chain Sealed
                                        </span>
                                    </div>
                                    <div className="bg-brand-dark/5 p-3 rounded-lg border border-brand-dark/5 font-mono text-[10px] break-all text-brand-gray-mid hover:text-brand-dark transition-colors">
                                        {proof.hashChainRoot}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
