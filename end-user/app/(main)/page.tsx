import type { Metadata } from "next";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";

import { StatsSection } from "@/components/home/stats-section";
import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";

import ChatbotFloating from "@/components/chat/ChatbotFloating";

export const metadata: Metadata = {
  title: "Trang chủ",
};

export default async function Home() {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesGrid categories={categories} />
      <FeaturedProducts products={products.data} />
      <StatsSection />
  <ChatbotFloating />
    </main>
  );
}
