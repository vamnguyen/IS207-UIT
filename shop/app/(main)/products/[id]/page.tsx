import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { ProductComments } from "@/components/products/product-comments";
import type { Metadata } from "next";
import { getProductById } from "@/services/products";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Sản phẩm không tìm thấy",
    };
  }

  return {
    title: `${product.name}`,
    description:
      product.description ||
      `Thuê ${product.name} với giá tốt nhất tại RentHub`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
        <ProductComments productId={product.id} />
      </div>
    </div>
  );
}
