"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Eye, ImageIcon } from "lucide-react";
import type { Product, Category, User } from "@/lib/types";
import { ProductStatus, Role } from "@/lib/enum";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";

// Mock data
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Điện tử",
    slug: "dien-tu",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Thời trang",
    slug: "thoi-trang",
    created_at: "2024-02-20T14:20:00Z",
  },
  {
    id: 3,
    name: "Gia dụng",
    slug: "gia-dung",
    created_at: "2024-03-10T09:15:00Z",
  },
];

const mockShops: User[] = [
  {
    id: 2,
    name: "Cửa hàng A",
    email: "shopa@example.com",
    role: Role.SHOP,
    address: null,
    avatar_url: null,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 3,
    name: "Cửa hàng B",
    email: "shopb@example.com",
    role: Role.SHOP,
    address: null,
    avatar_url: null,
    created_at: "2024-02-20T14:20:00Z",
  },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop Dell XPS 15",
    slug: "laptop-dell-xps-15",
    description: "Laptop cao cấp cho doanh nhân",
    price: 35000000,
    stock: 10,
    image_url: "/laptop-dell-xps.png",
    images: ["/laptop-dell-xps.png"],
    status: ProductStatus.IN_STOCK,
    category_id: 1,
    category: mockCategories[0],
    shop_id: 2,
    shop: mockShops[0],
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Áo thun nam",
    slug: "ao-thun-nam",
    description: "Áo thun cotton cao cấp",
    price: 250000,
    stock: 50,
    image_url: "/mens-tshirt.png",
    images: ["/mens-tshirt.png"],
    status: ProductStatus.IN_STOCK,
    category_id: 2,
    category: mockCategories[1],
    shop_id: 3,
    shop: mockShops[1],
    created_at: "2024-02-20T14:20:00Z",
    updated_at: "2024-02-20T14:20:00Z",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    status: ProductStatus.IN_STOCK,
    category_id: "",
    shop_id: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      stock: "",
      image_url: "",
      status: ProductStatus.IN_STOCK,
      category_id: "",
      shop_id: "",
    });
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || "",
      status: product.status,
      category_id: product.category_id.toString(),
      shop_id: product.shop_id.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmCreate = () => {
    const category = mockCategories.find(
      (c) => c.id === Number(formData.category_id)
    );
    const shop = mockShops.find((s) => s.id === Number(formData.shop_id));

    const newProduct: Product = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image_url: formData.image_url,
      images: formData.image_url ? [formData.image_url] : [],
      status: formData.status,
      category_id: Number(formData.category_id),
      category,
      shop_id: Number(formData.shop_id),
      shop,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const confirmEdit = () => {
    if (selectedProduct) {
      const category = mockCategories.find(
        (c) => c.id === Number(formData.category_id)
      );
      const shop = mockShops.find((s) => s.id === Number(formData.shop_id));

      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                image_url: formData.image_url,
                images: formData.image_url ? [formData.image_url] : [],
                status: formData.status,
                category_id: Number(formData.category_id),
                category,
                shop_id: Number(formData.shop_id),
                shop,
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );
      setIsEditDialogOpen(false);
      resetForm();
    }
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadgeVariant = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.IN_STOCK:
        return "default";
      case ProductStatus.RENTING:
        return "secondary";
      case ProductStatus.MAINTENANCE:
        return "destructive";
      default:
        return "outline";
    }
  };

  const ProductForm = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Tên sản phẩm *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="ten-san-pham"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Mô tả sản phẩm"
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Giá (VND) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Số lượng *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Danh mục *</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shop">Cửa hàng *</Label>
          <Select
            value={formData.shop_id}
            onValueChange={(value) =>
              setFormData({ ...formData, shop_id: value })
            }
          >
            <SelectTrigger id="shop">
              <SelectValue placeholder="Chọn cửa hàng" />
            </SelectTrigger>
            <SelectContent>
              {mockShops.map((shop) => (
                <SelectItem key={shop.id} value={shop.id.toString()}>
                  {shop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value as ProductStatus })
          }
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ProductStatus.IN_STOCK}>
              {ProductStatus.IN_STOCK}
            </SelectItem>
            <SelectItem value={ProductStatus.RENTING}>
              {ProductStatus.RENTING}
            </SelectItem>
            <SelectItem value={ProductStatus.MAINTENANCE}>
              {ProductStatus.MAINTENANCE}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL hình ảnh</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) =>
            setFormData({ ...formData, image_url: e.target.value })
          }
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả sản phẩm trong hệ thống
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Cửa hàng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                      {product.image_url ? (
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>{product.shop?.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border bg-muted">
                  {selectedProduct.image_url ? (
                    <Image
                      src={selectedProduct.image_url || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.slug}
                  </p>
                  <Badge
                    variant={getStatusBadgeVariant(selectedProduct.status)}
                  >
                    {selectedProduct.status}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Giá</Label>
                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                </div>
                <div>
                  <Label>Số lượng trong kho</Label>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedProduct.stock}
                  </p>
                </div>
                <div>
                  <Label>Danh mục</Label>
                  <p className="mt-1">{selectedProduct.category?.name}</p>
                </div>
                <div>
                  <Label>Cửa hàng</Label>
                  <p className="mt-1">{selectedProduct.shop?.name}</p>
                </div>
              </div>
              <div>
                <Label>Mô tả</Label>
                <p className="mt-1 text-sm">{selectedProduct.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Ngày tạo</Label>
                  <p className="mt-1 text-sm">
                    {formatDate(selectedProduct.created_at)}
                  </p>
                </div>
                <div>
                  <Label>Cập nhật lần cuối</Label>
                  <p className="mt-1 text-sm">
                    {formatDate(selectedProduct.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            <DialogDescription>
              Tạo sản phẩm mới trong hệ thống
            </DialogDescription>
          </DialogHeader>
          <ProductForm />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={confirmCreate}>Tạo sản phẩm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>
          <ProductForm />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={confirmEdit}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>{selectedProduct?.name}</strong>? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
