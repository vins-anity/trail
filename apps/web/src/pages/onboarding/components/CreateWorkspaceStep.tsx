import { IconBuildingSkyscraper } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

interface CreateWorkspaceStepProps {
    onComplete: (workspace: { id: string; name: string }) => void;
}

const workspaceSchema = z.object({
    name: z
        .string()
        .min(3, "Workspace name must be at least 3 characters")
        .max(50, "Workspace name must be less than 50 characters")
        .regex(
            /^[a-zA-Z0-9\s-_]+$/,
            "Only letters, numbers, spaces, hyphens, and underscores allowed"
        ),
    teamType: z.enum(["agency", "dev_shop", "product"]).default("agency"),
});

const TEAM_TYPES = [
    { id: "agency", label: "Creative Agency", icon: "🎨" },
    { id: "dev_shop", label: "Dev Shop", icon: "💻" },
    { id: "product", label: "Product Team", icon: "🚀" },
];

export function CreateWorkspaceStep({ onComplete }: CreateWorkspaceStepProps) {
    const [name, setName] = useState("");
    const [teamType, setTeamType] = useState("agency");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Client-side validation
        const validation = workspaceSchema.safeParse({ name, teamType });
        if (!validation.success) {
            setError(validation.error.issues[0]?.message || "Invalid input");
            setLoading(false);
            return;
        }

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
                body: JSON.stringify({
                    name,
                    workflowSettings: { teamType }, // STore team type in settings immediately
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create workspace");
            }

            const newWorkspace = await res.json();
            onComplete(newWorkspace);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-lg px-6 animate-fade-in-up mx-auto">
            {/* Brand Header */}
            <div className="text-center mb-10 space-y-4">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-brand-dark shadow-2xl mb-4 group transform transition-transform hover:scale-105 duration-500">
                    <div className="w-8 h-8 text-brand-light group-hover:rotate-12 transition-transform duration-500">
                        {/* Rocket Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
                            <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
                            <circle cx="15" cy="9" r="1" />
                        </svg>
                    </div>
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

                        {/* Team Type Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold font-heading text-brand-dark ml-1 flex items-center gap-2 uppercase tracking-wide">
                                <span className="text-lg">👥</span> Team Type
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {TEAM_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setTeamType(type.id)}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${teamType === type.id
                                                ? "bg-brand-dark text-brand-light border-brand-dark shadow-md scale-[1.02]"
                                                : "bg-white text-brand-gray-mid border-brand-gray-light hover:border-brand-accent-blue/50 hover:bg-brand-light/50"
                                            }`}
                                    >
                                        <span className="text-2xl">{type.icon}</span>
                                        <span className="text-xs font-bold text-center leading-tight">
                                            {type.label}
                                        </span>
                                    </button>
                                ))}
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
                            disabled={loading}
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
                </CardContent>
            </Card>
        </div>
    );
}
