import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPage } from "@/pages/dashboard";
import { ProofPacketsPage } from "@/pages/proofs";
import { AppProviders } from "./providers";

function App() {
    return (
        <AppProviders>
            <Routes>
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
            </Routes>
        </AppProviders>
    );
}

export default App;
