import { IconShieldCheck, IconUser } from "@tabler/icons-react";

export function LandingWhy() {
    return (
        <section className="relative py-32 overflow-hidden bg-brand-light font-sans">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent-green/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black font-heading leading-[1.1] text-brand-dark">
                                Why We Built <br />
                                <span className="text-brand-accent-blue">ShipDocket</span>
                            </h2>
                            <p className="text-2xl text-brand-gray-mid font-serif italic leading-relaxed">
                                "We ran a software agency for 10 years. We hated 'explaining'
                                bills."
                            </p>
                            <p className="text-lg text-brand-dark leading-relaxed font-light">
                                <strong className="font-bold">The Logistics of Trust.</strong> In
                                the shipping industry, you don't argue about delivery—you check the
                                Bill of Lading. Software should be no different.
                            </p>
                        </div>

                        <div className="space-y-8 pt-4">
                            <div className="flex gap-6 group">
                                <div className="w-16 h-16 rounded-2xl bg-brand-accent-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent-blue/20 transition-colors duration-300">
                                    <IconUser className="w-8 h-8 text-brand-accent-blue" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-heading text-brand-dark mb-2">
                                        Built for Business
                                    </h3>
                                    <p className="text-brand-gray-mid leading-relaxed">
                                        Developers stay in their flow. You get a business asset that
                                        proves value without micromanagement.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6 group">
                                <div className="w-16 h-16 rounded-2xl bg-brand-accent-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent-green/20 transition-colors duration-300">
                                    <IconShieldCheck className="w-8 h-8 text-brand-accent-green" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-heading text-brand-dark mb-2">
                                        Zero IP Risk
                                    </h3>
                                    <p className="text-brand-gray-mid leading-relaxed">
                                        We verify the shipping container (metadata), we never open
                                        the box (source code). Your IP is safe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent-blue/20 to-brand-accent-purple/20 rounded-[3rem] blur-3xl transform rotate-6 scale-95" />
                        <div className="relative bg-white border border-brand-gray-light rounded-[2.5rem] p-16 flex items-center justify-center min-h-[500px] shadow-2xl">
                            <div className="text-center space-y-8">
                                <div className="w-32 h-32 mx-auto bg-brand-light rounded-full flex items-center justify-center shadow-inner">
                                    <IconShieldCheck className="w-16 h-16 text-brand-dark opacity-80" />
                                </div>
                                <div>
                                    <p className="text-brand-accent-blue font-bold uppercase tracking-widest text-xs mb-3">
                                        Verified Logistics
                                    </p>
                                    <p className="text-4xl font-black font-heading text-brand-dark leading-tight">
                                        Don't just invoice.
                                        <br />
                                        Send a Proof Packet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
