import { IconLoader2, IconRocket } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const DEMO_USER_EMAIL = "demo@shipdocket.com";
const DEMO_USER_PASSWORD = "demo123456";

export function DemoPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    // If already authenticated, redirect to dashboard
    useEffect(() => {
        if (!authLoading && user) {
            navigate("/dashboard");
        }
    }, [user, authLoading, navigate]);

    const handleDemoAccess = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Sign in with demo credentials
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: DEMO_USER_EMAIL,
                password: DEMO_USER_PASSWORD,
            });

            if (signInError) {
                throw signInError;
            }

            // Redirect to dashboard
            navigate("/dashboard");
        } catch (err) {
            console.error("Demo login failed:", err);
            setError(
                "Unable to access demo. Please try again or contact support at manifest@shipdocket.com",
            );
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    // Auto-trigger demo access on page load
    useEffect(() => {
        if (!authLoading && !user) {
            handleDemoAccess();
        }
    }, [authLoading, user, handleDemoAccess]);

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <IconLoader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">Loading demo environment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive">Demo Access Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleDemoAccess} className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Retrying...
                                </>
                            ) : (
                                <>
                                    <IconRocket className="mr-2 h-4 w-4" />
                                    Try Again
                                </>
                            )}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
