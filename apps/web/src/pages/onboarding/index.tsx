import { IconBuildingSkyscraper, IconRocket } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export function OnboardingPage() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/workspaces`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create workspace");
            }

            // Redirect to dashboard
            // We use replace to prevent back navigation
            navigate("/dashboard", { replace: true });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />

            <Card className="w-full max-w-md relative border-white/10 bg-black/40 backdrop-blur-xl animate-fade-in shadow-2xl">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/20 animate-bounce-slow">
                        <IconRocket className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                        Create Your Workspace
                    </CardTitle>
                    <CardDescription>Give your agency or team a home on ShipDocket.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="workspace-name"
                                className="text-sm font-medium text-foreground/80 flex items-center gap-2"
                            >
                                <IconBuildingSkyscraper className="w-4 h-4 text-muted-foreground" />
                                Workspace Name
                            </label>
                            <Input
                                id="workspace-name"
                                placeholder="Acme Corp."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors h-11"
                                required
                                minLength={3}
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Get Started"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
