"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Category } from "@/lib/types";
import { ProductStatus } from "@/lib/enum";

const MIN_PRICE = 0;
const MAX_PRICE = 10000000;

export function ProductsFilters({ categories }: { categories: Category[] }) {
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, status]);
    } else {
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    }
  };

  const clearFilters = () => {
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <Card className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Khoảng giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={MAX_PRICE}
            min={MIN_PRICE}
            step={100000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Danh mục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability Status */}
      <Card className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Tình trạng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(ProductStatus).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`${key}`}
                checked={selectedStatus.includes(key)}
                onCheckedChange={(checked) =>
                  handleStatusChange(key, checked as boolean)
                }
              />
              <Label
                htmlFor={`${key}`}
                className="text-sm font-normal cursor-pointer"
              >
                {value}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Sắp xếp theo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { value: "newest", label: "Mới nhất" },
            { value: "price-low", label: "Giá thấp đến cao" },
            { value: "price-high", label: "Giá cao đến thấp" },
            { value: "popular", label: "Phổ biến nhất" },
          ].map((sort) => (
            <div key={sort.value} className="flex items-center space-x-2">
              <Checkbox id={`sort-${sort.value}`} />
              <Label
                htmlFor={`sort-${sort.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {sort.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full rounded-2xl bg-transparent"
        onClick={clearFilters}
      >
        Xóa bộ lọc
      </Button>
    </div>
  );
}
