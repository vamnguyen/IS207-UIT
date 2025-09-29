"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const images = product.images || [product.image_url || "/file.svg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
        <img
          src={images[currentImageIndex] || "/file.svg"}
          alt={product.product_name}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-background/80 backdrop-blur hover:bg-background"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-background/80 backdrop-blur hover:bg-background"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-primary"
                      : "bg-background/60"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                index === currentImageIndex
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={image || "/file.svg"}
                alt={`${product.product_name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
