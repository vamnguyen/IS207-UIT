import type { Metadata } from "next";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";

export const metadata: Metadata = {
  title: "Trang chủ",
};

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
