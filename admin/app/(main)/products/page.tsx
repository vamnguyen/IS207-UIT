"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Eye, ImageIcon } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductStatus } from "@/lib/enum";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { getProducts, deleteProduct } from "@/services/products";
import ProductFormDialog from "@/components/products/product-form-dialog";

export default function ProductsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: paginated } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts(page, 12),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const products: Product[] =
    paginated && Array.isArray(paginated.data) ? paginated.data : [];

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProduct(id),  
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Xoá sản phẩm thành công");
    },
  });

  // Thêm hàm mutation update status (ngừng kinh doanh)
  const updateStatusMut = useMutation({
    mutationFn: (id: number) => updateProductStatus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Ngừng kinh doanh sản phẩm thành công");
    },
    onError: () => {
      toast.error("Không thể ngừng kinh doanh sản phẩm");
    }
  });

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteMut.mutate(selectedProduct.id);
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
      case ProductStatus.SUSPEND:
        return "destructive";
      case ProductStatus.DISCONTINUE:
        return "destructive";
      case ProductStatus.OUT_OF_STOCK:
        return "destructive";
      default:
        return "outline";
    }
  };

  // Hàm lấy màu badge trạng thái products
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Còn hàng':
        return 'bg-[#7aa520] text-white';
      case 'Hết hàng':
        return 'bg-red-500 text-white';
      case 'Sắp về':
        return 'bg-[#cddd77] text-[#1f1f1f]';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1f1f1f] mb-2 font-bold">Quản lý sản phẩm</h1>
          <p className="text-gray-600">
            Quản lý tất cả sản phẩm trong hệ thống
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#e8eabc] p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng sản phẩm</p>
          <p className="text-2xl text-[#2c6c24]">142</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#e8eabc] p-4">
          <p className="text-sm text-gray-600 mb-1">Còn hàng</p>
          <p className="text-2xl text-[#7aa520]">128</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#e8eabc] p-4">
          <p className="text-sm text-gray-600 mb-1">Hết hàng</p>
          <p className="text-2xl text-red-500">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#e8eabc] p-4">
          <p className="text-sm text-gray-600 mb-1">Sắp về</p>
          <p className="text-2xl text-[#cddd77]">6</p>
        </div>
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
                  <TableCell className="font-medium text-sm text-[#7aa520]">{product.id}</TableCell>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                      {product.image_url ? (
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#1f1f1f]">{product.name}</TableCell>
                  <TableCell className="text-sm text-[#2c6c24]">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-sm text-[#7aa520]">{product.stock}</TableCell>
                  <TableCell>
                    
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{product.category?.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{product.shop?.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon" className="text-[#2c6c24]"
                        onClick={() => handleView(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon" className="text-[#7aa520]"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon" className="text-red-500"
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
        <DialogContent className="max-w-2xl" aria-describedby="view-product">
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

      {/* Create/Edit Dialog */}
      <ProductFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-lg" aria-describedby="delete-product">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn <strong>ngừng kinh doanh</strong> sản phẩm{" "}
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
