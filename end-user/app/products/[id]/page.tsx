import { mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
