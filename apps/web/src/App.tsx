import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/auth/login";
import { DashboardPage } from "@/pages/dashboard";
import { LandingPage } from "@/pages/landing";
import { OnboardingPage } from "@/pages/onboarding";
import { ProofPacketsPage } from "@/pages/proofs";
import { ProofDetailPage } from "@/pages/proofs/[id]";
import { SettingsPage } from "@/pages/settings";
import { AboutPage } from "@/pages/about";
import { PricingPage } from "@/pages/pricing";
import { WhyPage } from "@/pages/why";
import { ServicesPage } from "@/pages/services";
import { CareersPage } from "@/pages/careers";
import { BlogPage } from "@/pages/blog";
import { SecurityFaqPage } from "@/pages/security-faq";
import { TermsPage } from "@/pages/legal/terms";
import { PrivacyPage } from "@/pages/legal/privacy";
import { DpaPage } from "@/pages/legal/dpa";
import { AppProviders } from "./providers";

function App() {
    return (
        <AppProviders>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<LandingPage />} />
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

                    <Route element={<ProtectedRoute />}>
                        <Route path="/onboarding" element={<OnboardingPage />} />
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/proofs" element={<ProofPacketsPage />} />
                            <Route path="/proofs/:id" element={<ProofDetailPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </AppProviders>
    );
}

export default App;
