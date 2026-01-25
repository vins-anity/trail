import { LandingCta } from "@/components/landing/cta";
import { LandingFaq } from "@/components/landing/faq";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHero } from "@/components/landing/hero";
import { LandingProblem } from "@/components/landing/problem";
import { LandingWhy } from "@/components/landing/why";

export default function Home() {
  return (
    <>
      <LandingHero />
      <LandingProblem />
      <LandingFeatures />
      <LandingWhy />
      <LandingFaq />
      <LandingCta />
    </>
  );
}
