import { CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="py-24 px-6 max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-center tracking-tight">
                Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
                Start establishing trust for free. Upgrade when you need verify at scale.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Free Tier */}
                <div className="border border-border rounded-xl p-8 bg-card flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold">Manifest</h3>
                        <p className="text-muted-foreground mt-2">For freelancers & pilots.</p>
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-muted-foreground">/mo</span>
                        <p className="text-sm text-primary font-medium mt-2">
                            Free during Beta
                        </p>
                    </div>
                    <Button className="w-full mb-8" variant="outline" asChild>
                        <Link href="/login">Start Shipping</Link>
                    </Button>
                    <ul className="space-y-4 flex-1">
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />1 Active Project
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            Metadata-Only Proofs
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            30-Day Retention
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            Standard Share Links
                        </li>
                    </ul>
                </div>

                {/* Pro Tier */}
                <div className="border border-primary rounded-xl p-8 bg-card flex flex-col relative shadow-lg">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                    </div>
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold">Bill of Lading</h3>
                        <p className="text-muted-foreground mt-2">For high-trust agencies.</p>
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-bold">$149</span>
                        <span className="text-muted-foreground">/mo</span>
                    </div>
                    <Button className="w-full mb-8" asChild>
                        <Link href="/login">Start 14-Day Trial</Link>
                    </Button>
                    <ul className="space-y-4 flex-1">
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            <strong>Unlimited Projects</strong>
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            Custom Branding (White Label)
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            PDF Proof Exports
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            Permanent History
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            Priority Support
                        </li>
                    </ul>
                </div>

                {/* Enterprise Tier */}
                <div className="border border-border rounded-xl p-8 bg-card flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold">Enterprise</h3>
                        <p className="text-muted-foreground mt-2">For regulated industries.</p>
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-bold">Custom</span>
                    </div>
                    <Button className="w-full mb-8" variant="outline" asChild>
                        <a href="mailto:sales@shipdocket.com">Contact Sales</a>
                    </Button>
                    <ul className="space-y-4 flex-1">
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            MSA & SLA Support
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            Dedicated Instance
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            Custom Security Policies
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <CheckIcon className="w-5 h-5 text-primary" />
                            Audit Log Access
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-24 text-center">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="max-w-2xl mx-auto text-left grid gap-6">
                    <div className="border border-border p-6 rounded-lg">
                        <h4 className="font-semibold mb-2">Can I upgrade later?</h4>
                        <p className="text-sm text-muted-foreground">
                            Yes, you can upgrade from Manifest to Bill of Lading at any time.
                            Your history will be preserved.
                        </p>
                    </div>
                    <div className="border border-border p-6 rounded-lg">
                        <h4 className="font-semibold mb-2">Do you charge per developer?</h4>
                        <p className="text-sm text-muted-foreground">
                            No. We charge per workspace. You can invite your entire dev team
                            without extra costs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
