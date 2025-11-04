"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/lib/types";

export function CategoriesList({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`}>
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 bg-background/60 backdrop-blur">
            <CardContent className="p-6">
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-linear-to-br from-primary/10 to-primary/5">
                <img
                  src={category.image_url || "/file.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  {category.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium pt-2">
                  Xem sản phẩm
                  <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
