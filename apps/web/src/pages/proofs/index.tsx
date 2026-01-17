import { IconChevronRight, IconFileText, IconLoader2 } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useProofPackets } from "@/hooks/use-proofs";

export function ProofPacketsPage() {
    const { data, isLoading, error } = useProofPackets();

    // Fallback/Placeholder while we connect to real backend
    const proofs = data?.packets || [
        { id: "PP-2847", task: "Authentication System Overhaul", status: "Verified", date: "Jan 10, 2026" },
        { id: "PP-2846", task: "Stripe Integration", status: "Pending", date: "Jan 09, 2026" },
        { id: "PP-2845", task: "User Profile Settings", status: "Exported", date: "Jan 08, 2026" },
    ];

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Proof Packets</h1>
                    <p className="text-muted-foreground mt-1">Tamper-evident delivery receipts.</p>
                </div>
                <Button>Export Report</Button>
            </div>

            <div className="grid gap-4">
                {proofs.map((proof: any) => (
                    <Card key={proof.id} className="bg-card/50 backdrop-blur-sm border-white/5 hover:bg-card/80 transition-colors cursor-pointer group">
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <IconFileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-medium">{proof.task || proof.id}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{proof.id} • {proof.date || new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={proof.status === "Verified" ? "default" : "secondary"}>
                                    {proof.status || "Pending"}
                                </Badge>
                                <IconChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
