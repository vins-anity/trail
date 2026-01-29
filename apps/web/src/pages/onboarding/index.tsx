import {
    IconBrandAsana,
    IconBrandGithub,
    IconBrandSlack,
    IconBuildingSkyscraper,
    IconCheck,
    IconRocket,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export function OnboardingPage() {
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleConnect = (provider: "github" | "slack" | "jira") => {
        if (!workspaceId) return;
        const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
        window.location.href = `${baseUrl}/auth/${provider}/authorize?workspace_id=${workspaceId}`;
    };

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

            const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/workspaces`, {
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

            const newWorkspace = await res.json();
            setWorkspaceId(newWorkspace.id);
            setLoading(false);

            // Don't redirect yet, let them connect apps
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setLoading(false);
        }
    };

    if (workspaceId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-light relative overflow-hidden font-sans">
                {/* Background Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-accent-blue/10 blur-[120px] rounded-full animate-slower-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-accent-orange/10 blur-[120px] rounded-full animate-slower-pulse animation-delay-2000" />

                <div className="relative z-10 w-full max-w-lg px-6 animate-fade-in-up">
                    <div className="text-center mb-10 space-y-4">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-brand-accent-green/10 text-brand-accent-green mb-2 shadow-sm border border-brand-accent-green/20">
                            <IconCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-black font-heading tracking-tight text-brand-dark">
                            Workspace Created!
                        </h1>
                        <p className="text-brand-gray-mid font-serif italic text-lg">
                            Connect your tools to start tracking.
                        </p>
                    </div>

                    <Card className="border-brand-gray-light bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
                        <CardContent className="p-8 space-y-4">
                            <Button
                                onClick={() => handleConnect("github")}
                                className="w-full h-14 bg-[#24292e] hover:bg-[#2f363d] text-white justify-start px-6 rounded-xl font-heading font-medium text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                <IconBrandGithub className="w-6 h-6 mr-4" />
                                Connect GitHub
                            </Button>

                            <Button
                                onClick={() => handleConnect("slack")}
                                className="w-full h-14 bg-[#4A154B] hover:bg-[#611f69] text-white justify-start px-6 rounded-xl font-heading font-medium text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                <IconBrandSlack className="w-6 h-6 mr-4" />
                                Connect Slack
                            </Button>

                            <Button
                                onClick={() => handleConnect("jira")}
                                className="w-full h-14 bg-[#0052CC] hover:bg-[#0747a6] text-white justify-start px-6 rounded-xl font-heading font-medium text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                <IconBrandAsana className="w-6 h-6 mr-4" />{" "}
                                {/* Using Asana icon as Jira placeholder if missing */}
                                Connect Jira
                            </Button>

                            <div className="pt-8 text-center">
                                <Button
                                    onClick={() => {
                                        // Invalidate workspace status to ensure fresh data on dashboard
                                        queryClient.invalidateQueries({
                                            queryKey: ["workspace-status"],
                                        });
                                        navigate("/dashboard", { replace: true });
                                    }}
                                    variant="ghost"
                                    className="text-brand-gray-mid hover:text-brand-dark hover:bg-brand-light/50 font-medium"
                                >
                                    Skip for now &rarr;
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-accent-blue/10 blur-[120px] rounded-full animate-slower-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-accent-orange/10 blur-[120px] rounded-full animate-slower-pulse animation-delay-2000" />

            <div className="relative z-10 w-full max-w-lg px-6 animate-fade-in-up">
                {/* Brand Header */}
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-brand-dark shadow-2xl mb-4 group transform transition-transform hover:scale-105 duration-500">
                        <IconRocket className="w-8 h-8 text-brand-light group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <h1 className="text-5xl font-black font-heading tracking-tight text-brand-dark leading-[1.1]">
                        Welcome to <span className="text-brand-accent-blue">ShipDocket</span>
                    </h1>
                    <p className="text-brand-gray-mid text-lg font-serif italic">
                        Let's set up your command center.
                    </p>
                </div>

                {/* Glass Card */}
                <Card className="border-brand-gray-light bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
                    <CardContent className="p-8 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label
                                    htmlFor="workspace"
                                    className="text-sm font-bold font-heading text-brand-dark ml-1 flex items-center gap-2 uppercase tracking-wide"
                                >
                                    <IconBuildingSkyscraper className="w-4 h-4 text-brand-accent-blue" />
                                    Workspace Name
                                </label>
                                <div className="relative group">
                                    <Input
                                        id="workspace"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Acme Logistics"
                                        className="h-16 bg-brand-light/50 border-brand-gray-mid/20 hover:border-brand-accent-blue/50 focus:border-brand-accent-blue focus:ring-4 focus:ring-brand-accent-blue/10 text-lg px-6 transition-all rounded-xl text-brand-dark placeholder:text-brand-gray-mid/50 font-medium"
                                        required
                                        autoFocus
                                        minLength={3}
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-gray-mid pointer-events-none group-focus-within:text-brand-accent-blue transition-colors">
                                        Enter to continue ↵
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 animate-shake font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || name.length < 3}
                                className="w-full h-16 text-lg font-bold font-heading rounded-xl bg-brand-dark text-brand-light hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-brand-dark/20 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-brand-light/30 border-t-brand-light rounded-full animate-spin" />
                                        Setting up...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Create Workspace
                                        {/* Arrow Icon */}
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-label="Arrow right"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="pt-6 border-t border-brand-gray-light/50">
                            <div className="flex items-center justify-center gap-6 text-xs font-medium text-brand-gray-mid uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <IconCheck className="w-4 h-4 text-brand-accent-green" />
                                    Free Forever
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheck className="w-4 h-4 text-brand-accent-green" />
                                    No Credit Card
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
