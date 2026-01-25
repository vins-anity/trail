import { LandingLayout } from "@/components/layout/LandingLayout";

export function TermsPage() {
    return (
        <LandingLayout>
            <div className="py-24 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
                <p className="text-sm text-muted-foreground mb-12">Last Updated: January 2026</p>

                <div className="prose prose-invert max-w-none text-muted-foreground">
                    <p>
                        Welcome to ShipDocket. By accessing or using our website and services, you agree to be bound by these Terms of Service.
                    </p>

                    <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">1. Service Description</h3>
                    <p>
                        ShipDocket is a platform for verifying software delivery execution ("The Service"). We provide tools to generate "Proof Packets" based on metadata from your connected tools.
                    </p>

                    <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">2. Beta Usage</h3>
                    <p>
                        The Service is currently in "Beta". We make no guarantees regarding uptime or data retention during this period. We reserve the right to modify or discontinue features at any time.
                    </p>

                    <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">3. User Responsibilities</h3>
                    <p>
                        You are responsible for maintaining the security of your account credentials. You agree not to use the Service for any illegal or unauthorized purpose.
                    </p>

                    <h3 className="text-foreground mt-8 mb-4 font-bold text-xl">4. Limitation of Liability</h3>
                    <p>
                        To the maximum extent permitted by law, ShipDocket shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                    </p>
                </div>
            </div>
        </LandingLayout>
    );
}
