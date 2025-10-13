"use client";

import { useState, useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { getCategories } from "@/services/categories";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "@/services/uploads";
import PaginationControl from "@/components/pagination-control";
import { toast } from "sonner";
import { UploadFolder } from "@/lib/enum";
import { Loader2, X } from "lucide-react";

export default function ClientMyProductsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  const { data: user } = useQuery<{ id: number } | null>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!Cookies.get("auth_token"),
    staleTime: Infinity,
  });

  const shopId = user?.id ? String(user.id) : "";

  const { data: paginated, isLoading } = useQuery({
    queryKey: ["products", shopId, page],
    queryFn: () => getProductsByShopId(shopId, page, 10),
    enabled: !!shopId,
    staleTime: Infinity,
  });

  const products: Product[] = paginated?.data ?? [];

  const createMut = useMutation({
    mutationFn: (data: Partial<Product>) => createProduct(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products", shopId] });
      toast.success("Tạo sản phẩm thành công");
    },
  });

  const updateMut = useMutation({
    mutationFn: (payload: { id: number; data: Partial<Product> }) =>
      updateProduct(payload.id, payload.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products", shopId] });
      toast.success("Cập nhật sản phẩm thành công");
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products", shopId] });
      toast.success("Xoá sản phẩm thành công");
    },
  });

  const methods = useForm<Partial<Product>>({
    defaultValues: {},
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
    onDrop: async (acceptedFiles: File[]) => {
      setLoadingAttachments(true);

      try {
        const urls = await uploadFiles(
          acceptedFiles,
          UploadFolder.PRODUCT_IMAGES
        );
        if (urls && urls.length > 0) {
          setAttachments((prev) => [...prev, ...urls]);
        }
      } catch (err) {
        toast.error("Tải ảnh lên thất bại");
      } finally {
        setLoadingAttachments(false);
      }
    },
    onDropRejected: (fileRejections) => {
      const errors = fileRejections.map(({ file, errors }) => {
        return `${file.name} - ${errors.map((e) => e.message).join(", ")}`;
      });
      toast.error(`File upload failed: ${errors.join(", ")}`);
    },
  });

  const openCreate = () => {
    setEditing(null);
    methods.reset({
      name: "",
    });
    setAttachments([]);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    methods.reset(p);
    setAttachments(p.images || []);
    setOpen(true);
  };

  const onSubmit = (values: Partial<Product>) => {
    const payload = { ...values };

    if (attachments && attachments.length > 0) {
      payload.images = attachments;
    }

    if (editing) {
      updateMut.mutate({ id: editing.id, data: payload });
    } else {
      createMut.mutate(payload);
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
              <div className="flex justify-center mt-4">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-3">
                  {products.length === 0 && (
                    <div className="text-center text-muted-foreground">
                      Không có sản phẩm nào
                    </div>
                  )}

                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between bg-white dark:bg-background p-3 rounded shadow-sm border border-gray-100 dark:border-transparent hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={p.image_url || "/file.svg"}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {p.name}
                          </div>
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
                {products.length > 0 && (
                  <div>
                    <PaginationControl
                      current_page={paginated?.current_page}
                      last_page={paginated?.last_page}
                      onChange={(p: number) => setPage(p)}
                    />
                  </div>
                )}
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
          <DialogContent aria-describedby={undefined}>
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
                  <FormLabel htmlFor="description">Mô tả sản phẩm</FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      {...methods.register("description")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor="price">
                    Giá cho thuê / ngày (VND)
                  </FormLabel>
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

                <FormItem>
                  <FormLabel htmlFor="category_id">Danh mục</FormLabel>
                  <FormControl>
                    <Controller
                      control={methods.control}
                      name="category_id"
                      render={({ field }) => (
                        <Select
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(v: string) =>
                            field.onChange(Number(v))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Danh mục</SelectLabel>
                              {categories?.map((c: any) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor="images">Hình ảnh</FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`border-dashed border-2 p-4 rounded text-center cursor-pointer ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary"
                      } `}
                    >
                      <input {...getInputProps()} />
                      <div className="text-sm text-muted-foreground">
                        Kéo thả ảnh vào đây, hoặc click để chọn (tối đa nhiều
                        ảnh)
                      </div>
                    </div>
                  </FormControl>
                  {loadingAttachments && (
                    <div className="flex justify-center mt-4">
                      <Loader2 className="animate-spin" size={32} />
                    </div>
                  )}
                  {!loadingAttachments && attachments.length > 0 && (
                    <div className="mt-2 grid grid-cols-6 gap-2">
                      {attachments.map((url, i) => (
                        <div
                          key={`attach-${i}`}
                          className="relative bg-white dark:bg-transparent p-1 rounded border border-gray-100"
                        >
                          <img
                            src={url}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAttachments((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              );
                            }}
                            aria-label="Xoá ảnh"
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-md"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
