import { IconChevronRight, IconFileText, IconInbox, IconShieldCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProofCardSkeleton } from "@/components/ui/skeleton";
import { useProofPackets } from "@/hooks/use-proofs";
import { useWorkspaceStatus } from "@/hooks/use-workspace-status";

export function ProofPacketsPage() {
    const { data: workspace } = useWorkspaceStatus();
    const { data, isLoading, error } = useProofPackets({ workspaceId: workspace?.id });

    const proofs = data?.packets || [];

    if (isLoading) {
        return (
            <div className="space-y-8 animate-fade-in max-w-7xl mx-auto py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black font-heading tracking-tight text-brand-dark">
                            Proof Packets
                        </h1>
                        <p className="text-brand-gray-mid mt-1 font-serif italic text-lg">
                            Tamper-evident delivery receipts.
                        </p>
                    </div>
                </div>
                <div className="grid gap-4">
                    <ProofCardSkeleton />
                    <ProofCardSkeleton />
                    <ProofCardSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-xl bg-red-50 border border-red-100 text-red-600 font-medium flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Failed to load proofs. Please try again later.
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        draft: "bg-brand-gray-light text-brand-gray-mid border-brand-gray-mid/20",
        pending: "bg-brand-accent-orange/10 text-brand-accent-orange border-brand-accent-orange/20",
        finalized: "bg-brand-accent-green/10 text-brand-accent-green border-brand-accent-green/20",
        exported: "bg-brand-accent-blue/10 text-brand-accent-blue border-brand-accent-blue/20",
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black font-heading tracking-tight text-brand-dark flex items-center gap-3">
                        Proof Packets
                        <span className="text-sm font-normal text-brand-gray-mid bg-brand-light px-3 py-1 rounded-full border border-brand-gray-light/50 font-sans tracking-normal">
                            {proofs.length} Total
                        </span>
                    </h1>
                    <p className="text-brand-gray-mid mt-1 font-serif italic text-lg">
                        Tamper-evident delivery receipts.
                    </p>
                </div>
                <Button className="bg-brand-dark text-white hover:bg-black shadow-lg hover:-translate-y-0.5 transition-all rounded-xl px-6 font-heading font-bold">
                    Export Report
                </Button>
            </div>

            {proofs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border-2 border-dashed border-brand-gray-light bg-brand-light/20">
                    <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-gray-light">
                        <IconInbox className="h-10 w-10 text-brand-gray-mid/50" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-brand-dark mb-2">
                        No proof packets yet
                    </h3>
                    <p className="text-brand-gray-mid max-w-md mb-8 text-lg leading-relaxed">
                        Proof packets will appear here when tasks are tracked through your connected
                        tools. Make sure your integrations are set up correctly.
                    </p>
                    <Button
                        variant="outline"
                        className="border-brand-gray-mid/30 text-brand-dark hover:bg-brand-dark hover:text-white transition-all rounded-xl"
                    >
                        View Integration Status
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {proofs.map((proof) => (
                        <Link key={proof.id} to={`/proofs/${proof.id}`}>
                            <Card className="bg-white hover:bg-brand-light/30 border-brand-gray-light hover:border-brand-accent-blue/30 shadow-sm hover:shadow-md cursor-pointer group transition-all duration-300 rounded-xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between py-5 px-6">
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-xl bg-brand-light flex items-center justify-center text-brand-accent-blue group-hover:bg-brand-accent-blue group-hover:text-white transition-colors duration-300 shadow-sm">
                                            <IconShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold font-heading text-brand-dark mb-1 group-hover:text-brand-accent-blue transition-colors">
                                                {proof.task?.key || proof.id}
                                            </CardTitle>
                                            <p className="text-sm text-brand-gray-mid font-medium flex items-center gap-2">
                                                {proof.task?.summary || "Proof Packet"}
                                                <span className="w-1 h-1 rounded-full bg-brand-gray-mid/30" />
                                                {new Date(proof.createdAt).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    },
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <Badge
                                            className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs shadow-sm border ${
                                                statusColors[proof.status] ||
                                                "bg-brand-gray-light text-brand-gray-mid border-brand-gray-mid/10"
                                            }`}
                                        >
                                            {proof.status?.charAt(0).toUpperCase() +
                                                proof.status?.slice(1) || "Pending"}
                                        </Badge>
                                        <div className="h-8 w-8 rounded-full bg-transparent group-hover:bg-brand-dark/5 flex items-center justify-center transition-colors">
                                            <IconChevronRight className="h-5 w-5 text-brand-gray-mid group-hover:text-brand-dark group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
