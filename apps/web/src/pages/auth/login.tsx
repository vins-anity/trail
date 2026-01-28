import { valibotResolver } from "@hookform/resolvers/valibot";
import { IconAlertCircle, IconLoader2, IconShieldCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as v from "valibot";
import { useAuth } from "@/components/auth/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

const LoginSchema = v.object({
    email: v.pipe(v.string(), v.email("Please enter a valid email address.")),
    password: v.pipe(v.string(), v.minLength(6, "Password must be at least 6 characters.")),
});

type LoginFormData = v.InferOutput<typeof LoginSchema>;

export function LoginPage() {
    const [authError, setAuthError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        const checkSession = async () => {
            if (!loading && user) {
                // Double-check if the session is actually valid on the server
                // This prevents infinite loops where local storage has a token but it's revoked
                const { error } = await supabase.auth.getUser();
                if (!error) {
                    navigate("/dashboard");
                } else {
                    // Token is invalid, clear it
                    await supabase.auth.signOut();
                }
            }
        };
        checkSession();
    }, [user, loading, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        // biome-ignore lint/suspicious/noExplicitAny: Resolver type mismatch
        resolver: valibotResolver(LoginSchema) as any,
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setAuthError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setAuthError(error.message);
        } else {
            navigate("/dashboard");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 gradient-mesh opacity-60" />

            {/* Floating orbs for visual depth */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
            <div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "-1.5s" }}
            />
            <div
                className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "-3s" }}
            />

            {/* Login card */}
            <Card className="relative w-full max-w-md border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl animate-fade-in">
                <CardHeader className="space-y-4 text-center pb-2">
                    {/* Logo with glow */}
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center glow-md">
                            <IconShieldCheck className="h-9 w-9 text-white" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            ShipDocket
                        </CardTitle>
                        <CardDescription className="mt-2 text-muted-foreground">
                            Delivery assurance for software teams
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {authError && (
                            <Alert variant="destructive" className="animate-slide-up">
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertDescription>{authError}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                className="h-11 bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                                {...register("email")}
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive font-medium animate-slide-up">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                className="h-11 bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                                {...register("password")}
                                aria-invalid={!!errors.password}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive font-medium animate-slide-up">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 font-medium transition-all duration-200 hover:glow-sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Trust indicators */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Secure
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                Verified
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                Enterprise
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
