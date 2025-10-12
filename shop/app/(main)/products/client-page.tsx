"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ProductStatus } from "@/lib/enum";
import PaginationControl from "@/components/pagination-control";
import { Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductFilters } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";

const MIN_PRICE = 0;
const MAX_PRICE = 10000000;

export default function ClientProductsPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    min_price: MIN_PRICE,
    max_price: MAX_PRICE,
    categories: [],
    status: [],
    sort: undefined,
  });
  const [page, setPage] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    MIN_PRICE,
    MAX_PRICE,
  ]);

  const debouncedPrice = useDebounce(priceRange, 500);

  // cập nhật filters khi debounce xong
  useEffect(() => {
    updateFilter("min_price", debouncedPrice[0]);
    updateFilter("max_price", debouncedPrice[1]);
  }, [debouncedPrice]);

  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    updateFilter(
      "categories",
      checked
        ? [...(filters.categories || []), categoryId]
        : (filters.categories || []).filter((id) => id !== categoryId)
    );
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    updateFilter(
      "status",
      checked
        ? [...(filters.status || []), status]
        : (filters.status || []).filter((s) => s !== status)
    );
  };

  const handleSortChange = (sort: string, checked: boolean) => {
    updateFilter("sort", checked ? sort : undefined);
  };

  const clearFilters = () => {
    setFilters({
      min_price: MIN_PRICE,
      max_price: MAX_PRICE,
      categories: [],
      status: [],
      sort: undefined,
    });
    setPriceRange([MIN_PRICE, MAX_PRICE]);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: paginated, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", page, filters],
    queryFn: () => getProducts(page, 6, filters),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              Tất cả sản phẩm
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Khám phá hàng nghìn sản phẩm chất lượng cao với giá thuê hợp lý
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị{" "}
              <span className="font-medium">{paginated?.data.length}</span> sản
              phẩm / tổng số{" "}
              <span className="font-medium">{paginated?.total}</span> sản phẩm
            </p>
          </div>
        </div>

        {/* Filters & Products */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            {isLoadingCategories || !categories ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Price Range */}
                <Card className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Khoảng giá</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={(values) =>
                        setPriceRange([values[0], values[1]])
                      }
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
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={filters.categories?.includes(category.id)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(
                              category.id,
                              checked as boolean
                            )
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
                    {Object.values(ProductStatus).map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${value}`}
                          checked={filters.status?.includes(value)}
                          onCheckedChange={(checked) =>
                            handleStatusChange(value, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`${value}`}
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
                    ].map((sort) => (
                      <div
                        key={sort.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${sort.value}`}
                          checked={filters.sort === sort.value}
                          onCheckedChange={(checked) =>
                            handleSortChange(sort.value, checked as boolean)
                          }
                        />
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
            )}
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {isLoadingProducts || !paginated ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : paginated?.data.length === 0 ? (
              <div className="flex justify-center">Không có sản phẩm nào.</div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.data.map((product) => (
                    <Card
                      key={product.id}
                      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 bg-background/60 backdrop-blur overflow-hidden"
                    >
                      <div className="relative">
                        <Link href={`/products/${product.id}`}>
                          <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
                            <img
                              src={product.image_url || "/file.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>

                        {/* Status Badge */}
                        <Badge
                          className={`absolute top-3 left-3 ${
                            product.status === ProductStatus.IN_STOCK
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-yellow-500 hover:bg-yellow-600"
                          }`}
                        >
                          {product.status === ProductStatus.IN_STOCK
                            ? "Còn hàng"
                            : "Đang thuê"}
                        </Badge>

                        {/* Favorite Button */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-3 right-3 rounded-full w-8 h-8 p-0 bg-background/80 backdrop-blur hover:bg-background"
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.includes(product.id)
                                ? "fill-red-500 text-red-500"
                                : ""
                            }`}
                          />
                        </Button>
                      </div>

                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-balance line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
                            {product.description}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">
                              (4.8)
                            </span>
                          </div>

                          {/* Stock Info */}
                          <div className="text-sm text-muted-foreground">
                            Còn lại:{" "}
                            <span className="font-medium text-foreground">
                              {product.stock}
                            </span>{" "}
                            sản phẩm
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                {formatCurrency(product.price)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                / ngày
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Link href={`/products/${product.id}`}>
                                <Button size="sm" className="rounded-2xl">
                                  Xem chi tiết
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div>
                  <PaginationControl
                    current_page={paginated.current_page}
                    last_page={paginated.last_page}
                    onChange={(p: number) => setPage(p)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
