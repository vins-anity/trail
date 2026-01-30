import { OnboardingWizard } from "./components/OnboardingWizard";

export function OnboardingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light relative overflow-hidden font-sans py-12">
            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-accent-blue/10 blur-[120px] rounded-full animate-slower-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-accent-orange/10 blur-[120px] rounded-full animate-slower-pulse animation-delay-2000" />

            <div className="relative z-10 w-full">
                <OnboardingWizard />
            </div>
        </div>
    );
}
