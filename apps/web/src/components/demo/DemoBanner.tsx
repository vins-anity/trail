import { IconAlertCircle, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const DEMO_USER_EMAIL = "demo@shipdocket.com";

export function DemoBanner() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    // Only show banner if user is the demo account
    if (user?.email !== DEMO_USER_EMAIL) {
        return null;
    }

    const handleExitDemo = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <Alert className="border-amber-500/50 bg-amber-500/10">
            <IconAlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">
                    <strong>Demo Mode:</strong> You're viewing a sandbox workspace with sample data.
                    Data resets daily.
                </span>
                <Button size="sm" variant="outline" className="ml-4" onClick={handleExitDemo}>
                    <IconLogout className="h-3 w-3 mr-1" />
                    Exit Demo
                </Button>
            </AlertDescription>
        </Alert>
    );
}
