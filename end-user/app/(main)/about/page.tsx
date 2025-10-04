import { HeroSection } from "@/components/about/hero-section";
import { TeamSection } from "@/components/about/team-section";
import { StatsSection } from "@/components/about/stats-section";
import { ValuesSection } from "@/components/about/values-section";
import { CTASection } from "@/components/about/cta-section";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <TeamSection />
      <ValuesSection />
      <CTASection />
    </main>
  );
}
