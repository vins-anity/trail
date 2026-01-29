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
        { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
        { href: "/proofs", label: "Proof Packets", icon: IconFileText },
        { href: "/settings", label: "Settings", icon: IconSettings },
    ];

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark text-brand-light transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-brand-gray-mid/10",
                    !isSidebarOpen && "-translate-x-full md:w-0 md:opacity-0 md:overflow-hidden",
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="h-20 flex items-center px-8 border-b border-brand-light/10">
                        <IconShieldCheck className="h-7 w-7 text-brand-accent-green mr-3" />
                        <span className="font-heading font-black text-xl tracking-wide text-brand-light">
                            SHIPDOCKET
                        </span>
                    </div>

                    <div className="flex-1 py-8 px-4 space-y-2">
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
                                        "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative",
                                        isActive
                                            ? "bg-brand-light/10 text-brand-light shadow-lg shadow-black/20"
                                            : "text-brand-gray-mid hover:bg-brand-light/5 hover:text-brand-light",
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "h-5 w-5 transition-colors",
                                            isActive
                                                ? "text-brand-accent-green"
                                                : "text-brand-gray-mid group-hover:text-brand-light",
                                        )}
                                    />
                                    <span className="font-heading tracking-wide">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-6">
                        <div className="bg-brand-light/5 rounded-2xl p-5 border border-brand-light/5 backdrop-blur-sm">
                            <h4 className="text-xs font-bold font-heading text-brand-accent-blue mb-1 uppercase tracking-wider">
                                ShipDocket Enterprise
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-2 w-2 rounded-full bg-brand-accent-green animate-pulse"></div>
                                <p className="text-[11px] text-brand-gray-mid">
                                    System Operational
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 bg-brand-light">
                <header className="h-20 border-b border-brand-gray-mid/10 bg-white/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="text-brand-dark hover:text-brand-accent-orange md:hidden"
                        >
                            {isSidebarOpen ? (
                                <IconX className="h-6 w-6" />
                            ) : (
                                <IconMenu2 className="h-6 w-6" />
                            )}
                        </Button>
                        <h2 className="text-lg font-bold font-heading text-brand-dark">
                            {navItems.find((i) => i.href === location.pathname)?.label ||
                                "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex border-brand-gray-mid/30 text-brand-dark hover:bg-brand-dark hover:text-brand-light font-medium rounded-full px-4"
                        >
                            Feedback
                        </Button>

                        <div className="h-6 w-px bg-brand-gray-mid/20"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full bg-brand-dark text-brand-light hover:bg-brand-accent-orange transition-colors shadow-md"
                                >
                                    <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                                        {user?.email?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-60 p-2 rounded-xl border-brand-gray-mid/20 shadow-xl bg-white"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal p-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold text-brand-dark leading-none">
                                            {user?.user_metadata?.full_name || "ShipDocket User"}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground mt-1">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-brand-gray-mid/20 my-1" />
                                <DropdownMenuItem
                                    onClick={() => window.location.reload()}
                                    className="rounded-lg focus:bg-brand-light focus:text-brand-dark cursor-pointer"
                                >
                                    <IconLayoutDashboard className="mr-2 h-4 w-4 text-brand-gray-mid" />
                                    <span>Reset Onboarding</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-brand-gray-mid/20 my-1" />
                                <DropdownMenuGroup>
                                    <Link to="/settings">
                                        <DropdownMenuItem className="rounded-lg focus:bg-brand-light focus:text-brand-dark cursor-pointer">
                                            <IconSettings className="mr-2 h-4 w-4 text-brand-gray-mid" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="bg-brand-gray-mid/20 my-1" />
                                <DropdownMenuItem
                                    onClick={signOut}
                                    className="text-red-500 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                                >
                                    <IconLogout className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
