"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getCurrentUser } from "@/services/auth";
import {
  getProductsByShopId,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/products";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { useForm } from "react-hook-form";
import PaginationControl from "@/components/pagination-control";

export default function ClientMyProductsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: user } = useQuery<{ id: number } | null>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!Cookies.get("auth_token"),
    staleTime: Infinity,
  });

  const shopId = user?.id ? String(user.id) : "";

  const { data: paginated, isLoading } = useQuery({
    queryKey: ["products", shopId, page],
    queryFn: () => getProductsByShopId(shopId, page, 3),
    enabled: !!shopId,
    staleTime: Infinity,
  });

  const products: Product[] = paginated?.data ?? [];

  const createMut = useMutation({
    mutationFn: (data: Partial<Product>) => createProduct(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products", shopId] }),
  });

  const updateMut = useMutation({
    mutationFn: (payload: { id: number; data: Partial<Product> }) =>
      updateProduct(payload.id, payload.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products", shopId] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products", shopId] }),
  });

  const methods = useForm<Partial<Product>>({
    defaultValues: {},
  });

  const openCreate = () => {
    setEditing(null);
    methods.reset();
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    methods.reset(p);
    setOpen(true);
  };

  const onSubmit = (values: Partial<Product>) => {
    if (editing) {
      updateMut.mutate({ id: editing.id, data: values as Partial<Product> });
    } else {
      createMut.mutate({ ...values, shop_id: user?.id });
    }
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              Sản phẩm cho thuê của tôi
            </h1>
            <p className="text-muted-foreground text-sm">
              Quản lý sản phẩm: tạo, sửa, xoá
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={openCreate} className="rounded-2xl">
              Tạo sản phẩm mới
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <CardContent>
            {isLoading ? (
              <div>Đang tải...</div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between bg-background/50 p-3 rounded"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={p.image_url || "/file.svg"}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {p.stock} sản phẩm • {p.price} / ngày
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(p)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMut.mutate(p.id)}
                        >
                          Xoá
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <PaginationControl
                    current_page={paginated?.current_page}
                    last_page={paginated?.last_page}
                    onChange={(p: number) => setPage(p)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog for create / edit */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {/* hidden trigger - we use explicit buttons */}
            <div />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Sửa sản phẩm" : "Tạo sản phẩm"}
              </DialogTitle>
            </DialogHeader>

            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormItem>
                  <FormLabel htmlFor="name">Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      {...methods.register("name", { required: true })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor="price">Giá (VND)</FormLabel>
                  <FormControl>
                    <Input
                      id="price"
                      type="number"
                      {...methods.register("price", { valueAsNumber: true })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor="stock">Số lượng</FormLabel>
                  <FormControl>
                    <Input
                      id="stock"
                      type="number"
                      min={0}
                      {...methods.register("stock", { valueAsNumber: true })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <div className="flex items-center justify-end space-x-2 pt-4">
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      type="button"
                    >
                      Huỷ
                    </Button>
                    <Button type="submit">Lưu</Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
