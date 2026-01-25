import { LandingLayout } from "@/components/layout/LandingLayout";

export function SecurityFaqPage() {
    return (
        <LandingLayout>
            <div className="py-24 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Security FAQ</h1>
                <p className="text-lg text-muted-foreground mb-12">
                    We take the security of your metadata seriously. ShipDocket is designed from the ground up to be "Zero Knowledge" regarding your source code.
                </p>

                <div className="space-y-8">
                    <div className="border-b border-border pb-8">
                        <h3 className="text-xl font-bold mb-3">Do you read our source code?</h3>
                        <p className="text-muted-foreground">
                            **No.** We only access metadata via the GitHub API (PR titles, branch names, commit messages, timestamps). We never clone your repositories or read file contents. Your IP remains on your servers.
                        </p>
                    </div>

                    <div className="border-b border-border pb-8">
                        <h3 className="text-xl font-bold mb-3">Where is data stored?</h3>
                        <p className="text-muted-foreground">
                            All data is stored in **US-East (N. Virginia)** using Supabase (PostgreSQL). Supabase is SOC2 Type 2 compliant.
                        </p>
                    </div>

                    <div className="border-b border-border pb-8">
                        <h3 className="text-xl font-bold mb-3">Is data encrypted?</h3>
                        <p className="text-muted-foreground">
                            Yes. Data is encrypted **in transit** (TLS 1.2+) and **at rest** (AES-256).
                        </p>
                    </div>

                    <div className="border-b border-border pb-8">
                        <h3 className="text-xl font-bold mb-3">How do you manage access control?</h3>
                        <p className="text-muted-foreground">
                            We use Row Level Security (RLS) policies at the database level to ensure strict tenant isolation. Workspaces cannot access each other's data.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-3">Do you have a Bug Bounty program?</h3>
                        <p className="text-muted-foreground">
                            Not publicly at this time. However, we welcome responsible disclosure. Please email security@shipdocket.com.
                        </p>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}
