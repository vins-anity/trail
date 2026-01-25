import {
    IconFileText,
    IconLayoutDashboard,
    IconLogout,
    IconMenu2,
    IconSettings,
    IconShieldCheck,
    IconX,
} from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";

export function DashboardLayout() {
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const { user, signOut } = useAuth();
    const location = useLocation();

    const navItems = [
        { href: "/", label: "Dashboard", icon: IconLayoutDashboard },
        { href: "/proofs", label: "Proof Packets", icon: IconFileText },
        { href: "/settings", label: "Settings", icon: IconSettings },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card/50 backdrop-blur-xl border-r border-border/40 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                    !isSidebarOpen && "-translate-x-full md:w-0 md:opacity-0 md:overflow-hidden",
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-border/40">
                        <IconShieldCheck className="h-6 w-6 text-primary mr-2" />
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                            ShipDocket
                        </span>
                    </div>

                    <div className="flex-1 py-6 px-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                location.pathname === item.href ||
                                (item.href !== "/" && location.pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-md" />
                                    )}
                                    <Icon
                                        className={cn(
                                            "h-4 w-4 relative z-10 transition-colors",
                                            isActive
                                                ? "text-primary"
                                                : "text-muted-foreground group-hover:text-foreground",
                                        )}
                                    />
                                    <span className="relative z-10">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-border/40">
                        <div className="bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-lg p-4 border border-white/5">
                            <h4 className="text-xs font-semibold text-primary mb-1">
                                ShipDocket Enterprise
                            </h4>
                            <p className="text-[10px] text-muted-foreground">v0.1.0 • Connected</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {isSidebarOpen ? (
                                <IconX className="h-5 w-5" />
                            ) : (
                                <IconMenu2 className="h-5 w-5" />
                            )}
                        </Button>
                        <h2 className="text-sm font-medium text-foreground/80">
                            {navItems.find((i) => i.href === location.pathname)?.label ||
                                "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex bg-transparent border-primary/20 hover:bg-primary/10 text-primary"
                        >
                            Feedback
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/50"
                                >
                                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
                                        {user?.email?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.user_metadata?.full_name || "ShipDocket User"}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        // Reset local storage or just force a reload to re-trigger checks
                                        // For now, simpler: just reload dashboard
                                        window.location.reload();
                                    }}
                                >
                                    <IconLayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Reset Onboarding</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link to="/settings">
                                        <DropdownMenuItem>
                                            <IconSettings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={signOut}
                                    className="text-red-400 focus:text-red-400"
                                >
                                    <IconLogout className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
