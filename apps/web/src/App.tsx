import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPage } from "@/pages/dashboard";
import { ProofPacketsPage } from "@/pages/proofs";
import { AppProviders } from "./providers";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LoginPage } from "@/pages/auth/login";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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
              <Route
                path="/settings"
                element={
                  <div className="text-muted-foreground p-8">Settings (In Progress)</div>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </AppProviders>
  );
}

export default App;
