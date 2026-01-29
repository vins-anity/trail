import { ArrowRightIcon } from "@radix-ui/react-icons";
import { IconCalendar, IconRocket, IconShieldCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LandingCta() {
    return (
        <section className="relative py-32 overflow-hidden bg-brand-dark text-brand-light">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent-blue/10 rounded-full blur-[100px] opacity-50" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent-orange/10 rounded-full blur-[100px] opacity-30" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-10 align-middle flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm">
                    <IconShieldCheck className="w-4 h-4 text-brand-light" />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-light/70">
                        Secure & Verified
                    </span>
                </div>

                <h2 className="text-5xl md:text-7xl font-black font-heading leading-tight tracking-tight">
                    Ready to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-gray-mid">
                        Ship?
                    </span>
                </h2>

                <p className="text-xl md:text-2xl text-brand-gray-mid max-w-2xl mx-auto font-serif font-light leading-relaxed">
                    Join high-performing teams using ShipDocket to turn code into revenue.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 w-full max-w-md mx-auto">
                    <Link to="/demo" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="h-14 w-full sm:w-auto px-8 rounded-xl bg-brand-light text-brand-dark hover:bg-white hover:scale-105 transition-all duration-300 font-bold text-lg shadow-xl shadow-white/5 gap-2"
                        >
                            <IconRocket className="w-5 h-5 text-brand-accent-orange" />
                            Try Demo
                            <ArrowRightIcon className="w-5 h-5 ml-1" />
                        </Button>
                    </Link>
                    <a
                        href="https://calendly.com/shipdocket/demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                    >
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 w-full sm:w-auto px-8 rounded-xl border-white/20 text-brand-light hover:bg-white/10 hover:border-white/40 hover:text-brand-light transition-all duration-300 font-bold text-lg bg-transparent gap-2"
                        >
                            <IconCalendar className="w-5 h-5" />
                            Book a Demo
                        </Button>
                    </a>
                </div>

                <div className="pt-12 border-t border-white/5 w-full max-w-2xl mx-auto">
                    <p className="text-sm text-brand-gray-mid">
                        Questions? Email us at{" "}
                        <a
                            href="mailto:manifest@shipdocket.com"
                            className="text-brand-light font-bold hover:text-brand-accent-blue hover:underline transition-colors"
                        >
                            manifest@shipdocket.com
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
