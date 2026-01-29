import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AboutPage } from "@/pages/about";
import { LoginPage } from "@/pages/auth/login";
import { BlogPage } from "@/pages/blog";
import { CareersPage } from "@/pages/careers";
import { DashboardPage } from "@/pages/dashboard";
import { DemoPage } from "@/pages/demo";
import { LandingPage } from "@/pages/landing";
import { DpaPage } from "@/pages/legal/dpa";
import { PrivacyPage } from "@/pages/legal/privacy";
import { TermsPage } from "@/pages/legal/terms";
import { NotFoundPage } from "@/pages/not-found";
import { OnboardingPage } from "@/pages/onboarding";
import { PricingPage } from "@/pages/pricing";
import { ProofPacketsPage } from "@/pages/proofs";
import { ProofDetailPage } from "@/pages/proofs/[id]";
import { SecurityFaqPage } from "@/pages/security-faq";
import { ServicesPage } from "@/pages/services";
import { SettingsPage } from "@/pages/settings";
import { SharePage } from "@/pages/share/[token]";
import { WhyPage } from "@/pages/why";
import { AppProviders } from "./providers";

function App() {
    return (
        <AppProviders>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/why-shipdocket" element={<WhyPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/security-faq" element={<SecurityFaqPage />} />
                    <Route path="/legal/terms" element={<TermsPage />} />
                    <Route path="/legal/privacy" element={<PrivacyPage />} />
                    <Route path="/legal/dpa" element={<DpaPage />} />

                    {/* Public share page - no auth required */}
                    <Route path="/share/:token" element={<SharePage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/onboarding" element={<OnboardingPage />} />
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/proofs" element={<ProofPacketsPage />} />
                            <Route path="/proofs/:id" element={<ProofDetailPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Route>
                    </Route>

                    {/* Catch-all 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </AppProviders>
    );
}

export default App;
