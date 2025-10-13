import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/services/products";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/services/categories";
import { getAdminUsersByRole } from "@/services/users";
import { ProductStatus, UploadFolder } from "@/lib/enum";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "@/services/uploads";
import { Loader2, X } from "lucide-react";

interface ProductFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: Product | null;
}

export default function ProductFormDialog({
  open,
  setOpen,
  product,
}: ProductFormDialogProps) {
  const qc = useQueryClient();
  const [attachments, setAttachments] = useState<string[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  const methods = useForm<Partial<Product>>({
    defaultValues: {},
  });

  // ⚡ Khi product thay đổi => reset form
  useEffect(() => {
    methods.reset(
      product || {
        name: "",
      }
    );
    setAttachments(product?.images || []);
  }, [product, methods]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: shops } = useQuery({
    queryKey: ["shops"],
    queryFn: () => getAdminUsersByRole("shop"),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

  const createMut = useMutation({
    mutationFn: (data: Partial<Product>) => createProduct(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Tạo sản phẩm thành công");
    },
  });

  const updateMut = useMutation({
    mutationFn: (payload: { id: number; data: Partial<Product> }) =>
      updateProduct(payload.id, payload.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Cập nhật sản phẩm thành công");
    },
  });

  const onSubmit = (values: Partial<Product>) => {
    const payload = { ...values };

    if (attachments && attachments.length > 0) {
      payload.images = attachments;
    }

    if (product) {
      updateMut.mutate({ id: product.id, data: payload });
    } else {
      createMut.mutate(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* hidden trigger - we use explicit buttons */}
        <div />
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Cập nhật thông tin sản phẩm"
              : "Tạo sản phẩm mới trong hệ thống"}
          </DialogDescription>
        </DialogHeader>

        <Form {...methods}>
          <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
            <FormItem>
              <FormLabel htmlFor="name">Tên sản phẩm</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Tên sản phẩm"
                  {...methods.register("name", { required: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="slug">Slug</FormLabel>
              <FormControl>
                <Input
                  id="slug"
                  placeholder="slug"
                  {...methods.register("slug")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="description">Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  {...methods.register("description")}
                  placeholder="Mô tả sản phẩm"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel htmlFor="price">Giá cho thuê / ngày (VND)</FormLabel>
              <FormControl>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  {...methods.register("price", {
                    valueAsNumber: true,
                    required: true,
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel htmlFor="stock">Số lượng</FormLabel>
                <FormControl>
                  <Input
                    id="stock"
                    type="number"
                    min={0}
                    {...methods.register("stock", {
                      valueAsNumber: true,
                      required: true,
                    })}
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
                        onValueChange={(v: string) => field.onChange(Number(v))}
                      >
                        <SelectTrigger className="w-full">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel htmlFor="shop_id">Cửa hàng</FormLabel>
                <FormControl>
                  <Controller
                    control={methods.control}
                    name="shop_id"
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(v: string) => field.onChange(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cửa hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cửa hàng</SelectLabel>
                            {shops?.map((c: any) => (
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
                <FormLabel htmlFor="status">Trạng thái</FormLabel>
                <FormControl>
                  <Controller
                    control={methods.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(v: ProductStatus) => field.onChange(v)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Chọn trạng thái" />
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
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

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
                    Kéo thả ảnh vào đây, hoặc click để chọn (tối đa nhiều ảnh)
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
                <Button type="submit">
                  {product ? "Lưu thay đổi" : "Tạo sản phẩm"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
