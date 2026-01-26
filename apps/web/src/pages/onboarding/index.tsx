import { IconBuildingSkyscraper, IconCheck, IconRocket, IconBrandGithub, IconBrandSlack, IconBrandAsana } from "@tabler/icons-react";
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
            <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
                {/* Background (Same as before) */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full animate-slower-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <div className="relative z-10 w-full max-w-lg px-4 animate-fade-in-up">
                    <div className="text-center mb-8 space-y-2">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-4">
                            <IconCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Workspace Created!</h1>
                        <p className="text-gray-400">Connect your tools to start tracking.</p>
                    </div>

                    <Card className="border-white/10 bg-gray-900/40 backdrop-blur-2xl">
                        <CardContent className="p-8 space-y-4">
                            <Button
                                onClick={() => handleConnect("github")}
                                className="w-full h-12 bg-[#24292e] hover:bg-[#2f363d] text-white border border-white/10 justify-start px-4"
                            >
                                <IconBrandGithub className="w-5 h-5 mr-3" />
                                Connect GitHub
                            </Button>

                            <Button
                                onClick={() => handleConnect("slack")}
                                className="w-full h-12 bg-[#4A154B] hover:bg-[#611f69] text-white border border-white/10 justify-start px-4"
                            >
                                <IconBrandSlack className="w-5 h-5 mr-3" />
                                Connect Slack
                            </Button>

                            <Button
                                onClick={() => handleConnect("jira")}
                                className="w-full h-12 bg-[#0052CC] hover:bg-[#0747a6] text-white border border-white/10 justify-start px-4"
                            >
                                <IconBrandAsana className="w-5 h-5 mr-3" /> {/* Using Asana icon as Jira placeholder if missing */}
                                Connect Jira
                            </Button>

                            <div className="pt-6">
                                <Button
                                    onClick={() => navigate("/dashboard", { replace: true })}
                                    variant="ghost"
                                    className="w-full text-gray-400 hover:text-white"
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
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
            {/* 🌌 Aurora Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full animate-slower-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full animate-slower-pulse animation-delay-2000" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]" />

            <div className="relative z-10 w-full max-w-lg px-4 animate-fade-in-up">
                {/* Brand Header */}
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 shadow-2xl mb-4 group">
                        <IconRocket className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Welcome to ShipDocket
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Let's set up your command center.
                    </p>
                </div>

                {/* Glass Card */}
                <Card className="border-white/10 bg-gray-900/40 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <CardContent className="p-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label
                                    htmlFor="workspace"
                                    className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2"
                                >
                                    <IconBuildingSkyscraper className="w-4 h-4 text-gray-500" />
                                    Workspace Name
                                </label>
                                <div className="relative group">
                                    <Input
                                        id="workspace"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Acme Logistics"
                                        className="h-14 bg-black/40 border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-lg px-4 transition-all rounded-xl text-white placeholder:text-gray-600"
                                        required
                                        autoFocus
                                        minLength={3}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600 pointer-events-none group-focus-within:text-blue-400 transition-colors">
                                        Enter to continue ↵
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3 animate-shake">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || name.length < 3}
                                className="w-full h-14 text-base font-semibold rounded-xl bg-white text-black hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        Setting up...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Create Workspace
                                        {/* Arrow Icon */}
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <IconCheck className="w-3.5 h-3.5 text-green-500" />
                                    Free Forever
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <IconCheck className="w-3.5 h-3.5 text-green-500" />
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
