import { valibotResolver } from "@hookform/resolvers/valibot";
import {
    IconAlertCircle,
    IconBrandGithub,
    IconBrandGoogle,
    IconLoader2,
    IconShieldCheck,
} from "@tabler/icons-react";
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

    const signInWithGoogle = async () => {
        setAuthError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });

        if (error) {
            setAuthError(error.message);
        }
    };

    const signInWithGitHub = async () => {
        setAuthError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });

        if (error) {
            setAuthError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-light">
                <IconLoader2 className="h-8 w-8 animate-spin text-brand-dark" />
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-brand-light p-4 overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-accent-blue/5 blur-[120px] rounded-full animate-slower-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-accent-orange/5 blur-[120px] rounded-full animate-slower-pulse animation-delay-2000" />

            {/* Login card */}
            <Card className="relative w-full max-w-md border-brand-gray-light bg-white/80 backdrop-blur-xl shadow-2xl animate-fade-in-up rounded-3xl overflow-hidden">
                <CardHeader className="space-y-6 text-center pb-2 pt-10">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-2xl bg-brand-dark flex items-center justify-center shadow-lg shadow-brand-dark/20 transform hover:scale-105 transition-transform duration-500">
                            <IconShieldCheck className="h-10 w-10 text-brand-light" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-4xl font-black font-heading tracking-tight text-brand-dark">
                            ShipDocket
                        </CardTitle>
                        <CardDescription className="mt-2 text-brand-gray-mid font-serif italic text-lg">
                            Delivery assurance for software teams
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-8 px-8 pb-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {authError && (
                            <Alert
                                variant="destructive"
                                className="animate-slide-up bg-red-50 border-red-100 text-red-600"
                            >
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertDescription>{authError}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                className="h-12 bg-white border-brand-gray-mid/30 focus:border-brand-dark focus:ring-brand-dark/5 transition-all rounded-xl text-base"
                                {...register("email")}
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 font-medium animate-slide-up">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                className="h-12 bg-white border-brand-gray-mid/30 focus:border-brand-dark focus:ring-brand-dark/5 transition-all rounded-xl text-base"
                                {...register("password")}
                                aria-invalid={!!errors.password}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 font-medium animate-slide-up">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold font-heading rounded-xl bg-brand-dark text-brand-light hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-xl shadow-brand-dark/10"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        {/* OAuth Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-brand-gray-light" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="bg-white px-4 text-brand-gray-mid">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* OAuth Providers */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 border-brand-gray-light bg-white hover:bg-brand-light hover:border-brand-gray-mid/50 text-brand-dark font-medium rounded-xl transition-all"
                                onClick={signInWithGoogle}
                            >
                                <IconBrandGoogle className="mr-2 h-5 w-5 text-brand-accent-blue" />
                                Google
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 border-brand-gray-light bg-white hover:bg-brand-light hover:border-brand-gray-mid/50 text-brand-dark font-medium rounded-xl transition-all"
                                onClick={signInWithGitHub}
                            >
                                <IconBrandGithub className="mr-2 h-5 w-5" />
                                GitHub
                            </Button>
                        </div>
                    </form>
                    <div className="mt-8 text-center text-sm text-brand-gray-mid">
                        <p>
                            Want to explore first?{" "}
                            <a
                                href="/demo"
                                className="font-bold text-brand-dark hover:text-brand-accent-blue hover:underline transition-colors"
                            >
                                Try the demo
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-brand-gray-mid/50 text-xs font-serif italic">
                &copy; {new Date().getFullYear()} ShipDocket. All rights reserved.
            </div>
        </div>
    );
}
