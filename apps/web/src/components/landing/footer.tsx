import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconShieldCheck,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function LandingFooter() {
    return (
        <footer className="bg-white border-t border-brand-gray-light pb-12 pt-16 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shadow-lg shadow-brand-dark/20 group-hover:scale-105 transition-transform duration-300">
                                <IconShieldCheck className="h-6 w-6 text-brand-light" />
                            </div>
                            <span className="font-heading font-black text-xl tracking-tight text-brand-dark">
                                ShipDocket
                            </span>
                        </Link>
                        <p className="text-brand-gray-mid text-sm leading-relaxed font-serif max-w-xs">
                            The Delivery Supply Chain for modern software teams. Turn commits into
                            contracts and get paid faster.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-brand-light transition-all duration-300"
                            >
                                <IconBrandTwitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-brand-light transition-all duration-300"
                            >
                                <IconBrandGithub className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-brand-light transition-all duration-300"
                            >
                                <IconBrandLinkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs mb-6">
                            Product
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-brand-gray-mid">
                            <li>
                                <Link
                                    to="/features"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/integrations"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/pricing"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/changelog"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Changelog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/docs"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs mb-6">
                            Company
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-brand-gray-mid">
                            <li>
                                <Link
                                    to="/about"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/careers"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/partners"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Partners
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-brand-dark uppercase tracking-wider text-xs mb-6">
                            Legal
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-brand-gray-mid">
                            <li>
                                <Link
                                    to="/privacy"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/security"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    Security
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dpa"
                                    className="hover:text-brand-accent-blue transition-colors"
                                >
                                    DPA
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-brand-gray-light flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-brand-gray-mid font-medium">
                        &copy; {new Date().getFullYear()} ShipDocket Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-accent-green animate-pulse" />
                        <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
