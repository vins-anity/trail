import { IconChevronRight, IconFileText, IconLoader2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useProofPackets } from "@/hooks/use-proofs";

export function ProofPacketsPage() {
    const { data, isLoading, error } = useProofPackets();

    const proofs = data?.packets || [];

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive">
                Failed to load proofs. Please try again later.
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        draft: "bg-yellow-500/10 text-yellow-500",
        pending: "bg-orange-500/10 text-orange-500",
        finalized: "bg-green-500/10 text-green-500",
        exported: "bg-blue-500/10 text-blue-500",
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Proof Packets
                    </h1>
                    <p className="text-muted-foreground mt-1">Tamper-evident delivery receipts.</p>
                </div>
                <Button>Export Report</Button>
            </div>

            {proofs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No proof packets found. They will appear here when tasks are tracked.
                </div>
            ) : (
                <div className="grid gap-4">
                    {proofs.map((proof: any) => (
                        <Link key={proof.id} to={`/proofs/${proof.id}`}>
                            <Card className="bg-card/50 backdrop-blur-sm border-white/5 hover:bg-card/80 transition-colors cursor-pointer group">
                                <CardHeader className="flex flex-row items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <IconFileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-medium">
                                                {proof.task?.key || proof.taskId || proof.id}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {proof.task?.summary || "Proof Packet"} • {new Date(proof.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge className={statusColors[proof.status] || "bg-muted text-muted-foreground"}>
                                            {proof.status?.charAt(0).toUpperCase() + proof.status?.slice(1) || "Pending"}
                                        </Badge>
                                        <IconChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
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

