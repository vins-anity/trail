import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/auth/login";
import { DashboardPage } from "@/pages/dashboard";
import { ProofPacketsPage } from "@/pages/proofs";
import { ProofDetailPage } from "@/pages/proofs/[id]";
import { SettingsPage } from "@/pages/settings";
import { AppProviders } from "./providers";

function App() {
    return (
        <AppProviders>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/" element={<DashboardPage />} />
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
