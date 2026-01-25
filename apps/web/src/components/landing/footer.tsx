import { ReaderIcon } from "@radix-ui/react-icons";

export function LandingFooter() {
    return (
        <footer className="border-t border-border bg-card">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <ReaderIcon className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="font-semibold">ShipDocket</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The Bill of Lading for Software.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="#features"
                                    className="hover:text-foreground transition"
                                >
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="hover:text-foreground transition"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition"
                                >
                                    Integrations
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition"
                                >
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-foreground transition"
                                >
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>
                        © 2026 ShipDocket. Verify everything.
                    </p>
                </div>
            </div>
        </footer>
    );
}
