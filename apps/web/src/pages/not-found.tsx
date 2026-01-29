import { Home, MoveLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-background relative flex items-center justify-center p-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full relative z-10 text-center space-y-8 animate-fade-in">
                {/* 404 Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-primary/20 text-primary text-xs font-medium tracking-wide mb-4 animate-slide-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    ERROR 404
                </div>

                <div className="space-y-4">
                    <h1 className="text-7xl font-black tracking-tighter text-foreground drop-shadow-sm">
                        Lost in Space
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        The page you are looking for has been moved, deleted, or never existed in
                        this dimension.
                    </p>
                </div>

                {/* Visual element */}
                <div className="relative py-12">
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full animate-pulse-glow" />
                    <div className="relative flex justify-center">
                        <div className="w-32 h-32 rounded-3xl glass flex items-center justify-center animate-float shadow-2xl border-white/10">
                            <Search className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover-lift shadow-lg shadow-primary/20"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-foreground font-semibold transition-all hover-lift"
                    >
                        <MoveLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                <div className="pt-8 text-xs text-muted-foreground font-mono">
                    SHIPDOCKET-NAV-ERROR {/* TRACE_ID: */}
                    {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
            </div>
        </div>
    );
};
