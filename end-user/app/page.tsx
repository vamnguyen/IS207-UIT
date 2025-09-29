import { CategoriesGrid } from "@/components/home/categories-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesGrid />
      <FeaturedProducts />
      <StatsSection />
    </main>
  );
}
