import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { IconLoader2 } from "@tabler/icons-react";

export function ProtectedRoute() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <IconLoader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
