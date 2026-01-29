import { IconAlertTriangle, IconChartBar, IconCode, IconUser } from "@tabler/icons-react";

export function LandingProblem() {
    return (
        <section className="bg-white border-t border-b border-brand-gray-light py-32 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-brand-light/50 pattern-grid-lg opacity-50" />

            <div className="max-w-6xl mx-auto px-6 space-y-20 relative z-10">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent-orange/10 text-brand-accent-orange text-xs font-bold uppercase tracking-widest border border-brand-accent-orange/20">
                        <IconAlertTriangle className="w-3 h-3" />
                        The Problem
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tight text-brand-dark">
                        The Invoice Gap
                    </h2>
                    <p className="text-xl md:text-2xl text-brand-gray-mid max-w-3xl mx-auto font-serif leading-relaxed">
                        You ship code. You bill for hours. The client pays for trust.{" "}
                        <br className="hidden md:block" />
                        When those don't align, you don't get paid.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-brand-light rounded-3xl p-8 border border-brand-gray-light hover:border-brand-accent-blue/30 hover:shadow-xl transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-brand-gray-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <IconUser className="w-7 h-7 text-brand-accent-blue" />
                        </div>
                        <h3 className="text-2xl font-bold font-heading text-brand-dark mb-4 group-hover:text-brand-accent-blue transition-colors">
                            The Black Box
                        </h3>
                        <p className="text-brand-gray-mid leading-relaxed">
                            Your team spent 40 hours on backend migrations. The client sees nothing.
                            To them, the work didn't happen because they can't touch it.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-brand-light rounded-3xl p-8 border border-brand-gray-light hover:border-brand-accent-purple/30 hover:shadow-xl transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-brand-gray-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <IconCode className="w-7 h-7 text-brand-accent-purple" />
                        </div>
                        <h3 className="text-2xl font-bold font-heading text-brand-dark mb-4 group-hover:text-brand-accent-purple transition-colors">
                            The 'Status' Chase
                        </h3>
                        <p className="text-brand-gray-mid leading-relaxed">
                            Clients ask 'Is it done?' because Jira is stale and Slack is noisy. You
                            lose billable hours acting as a human status bot explaining technical
                            details.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-brand-light rounded-3xl p-8 border border-brand-gray-light hover:border-brand-accent-orange/30 hover:shadow-xl transition-all duration-300 group md:col-span-2 lg:col-span-1">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-brand-gray-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <IconChartBar className="w-7 h-7 text-brand-accent-orange" />
                        </div>
                        <h3 className="text-2xl font-bold font-heading text-brand-dark mb-4 group-hover:text-brand-accent-orange transition-colors">
                            Invoice Friction
                        </h3>
                        <p className="text-brand-gray-mid leading-relaxed">
                            You send the bill. They ask for 'details.' You scramble to find
                            screenshots and git logs just to defend your revenue and prove you did
                            the work.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-brand-dark text-brand-light shadow-lg">
                        <IconAlertTriangle className="w-5 h-5 text-brand-accent-orange animate-pulse" />
                        <span className="font-bold text-sm uppercase tracking-wider">
                            Result: Revenue at Risk
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
