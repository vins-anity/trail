import { LandingLayout } from "@/components/layout/LandingLayout";

export function PrivacyPage() {
    return (
        <LandingLayout>
            <div className="py-24 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground mb-12">Last Updated: January 2026</p>

                <div className="prose prose-invert max-w-none text-muted-foreground">
                    <p>
                        Your privacy is important to us. This Privacy Policy explains how ShipDocket ("we", "us", or "our") collects, uses, and protects your information.
                    </p>

                    <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">1. Information We Collect</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>**Account Information:** Name, email address, password.</li>
                        <li>**Integration Data:** Metadata from connected tools (GitHub, Jira) including PR titles, commit messages, and timestamps.</li>
                        <li>**Usage Data:** Logs of how you interact with our platform.</li>
                    </ul>

                    <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">2. How We Use Information</h3>
                    <p>
                        We use your information to operate the Service, generate Proof Packets, and improve our platform. We do not sell your personal data to third parties.
                    </p>

                    <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">3. Data Retention</h3>
                    <p>
                        We retain your data for as long as your account is active. You may request deletion of your account and data at any time.
                    </p>
                </div>
            </div>
        </LandingLayout>
    );
}
