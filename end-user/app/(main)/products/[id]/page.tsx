import { mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import type { Metadata } from "next";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Sản phẩm không tìm thấy",
    };
  }

  return {
    title: `${product.product_name}`,
    description:
      product.description ||
      `Thuê ${product.product_name} với giá tốt nhất tại RentHub`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);

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
