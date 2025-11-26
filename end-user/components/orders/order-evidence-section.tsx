"use client";

import { useState } from "react";
import { Order, OrderEvidence } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadOrderEvidence } from "@/services/orders";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Upload, FileVideo, FileImage } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { OrderStatus, OrderType } from "@/lib/enum";

interface OrderEvidenceSectionProps {
  order: Order;
  onEvidenceUploaded: () => void;
}

export function OrderEvidenceSection({
  order,
  onEvidenceUploaded,
}: OrderEvidenceSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload file to generic upload endpoint
      const formData = new FormData();
      formData.append("files[]", file);
      formData.append("folder", "evidences");

      const uploadRes = await axiosInstance.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const mediaUrl = uploadRes.data.urls[0];

      // 2. Create evidence record
      let type: OrderType = OrderType.RECEIVE_PACKAGE; // Default for user
      // Determine type based on context - simplified logic
      // In real app, might let user choose or infer strictly from status
      if (order.status === OrderStatus.PROCESSING)
        type = OrderType.SEND_PACKAGE; // Shop
      if (order.status === OrderStatus.DELIVERED)
        type = OrderType.RECEIVE_PACKAGE; // User
      if (order.status === OrderStatus.RETURNED)
        type = OrderType.RETURN_PACKAGE; // User

      await uploadOrderEvidence(order.id, {
        type,
        media_url: mediaUrl,
        note,
      });

      toast.success("Đã tải lên bằng chứng thành công");
      setFile(null);
      setNote("");
      onEvidenceUploaded();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tải lên");
    } finally {
      setIsUploading(false);
    }
  };

  const getTypeLabel = (type: OrderType) => {
    switch (type) {
      case OrderType.SEND_PACKAGE:
        return "Shop gửi hàng";
      case OrderType.RECEIVE_PACKAGE:
        return "Khách nhận hàng";
      case OrderType.RETURN_PACKAGE:
        return "Khách trả hàng";
      case OrderType.RECEIVE_RETURN:
        return "Shop nhận trả";
      default:
        return type;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Bằng chứng đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upload Form */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-4">Tải lên bằng chứng mới</h4>
            <div className="grid gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="evidence-file">
                  <FileVideo className="size-4" /> Video /{" "}
                  <FileImage className="size-4" /> Hình ảnh
                </Label>
                <Input
                  id="evidence-file"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="evidence-note">Ghi chú</Label>
                <Textarea
                  id="evidence-note"
                  placeholder="Mô tả tình trạng hàng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-fit"
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Tải lên
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-medium">Lịch sử</h4>
            {order.evidences && order.evidences.length > 0 ? (
              <div className="relative border-l border-muted ml-2 space-y-6 pb-2">
                {order.evidences.map((evidence) => (
                  <div key={evidence.id} className="ml-6 relative">
                    <div className="absolute -left-[31px] mt-1.5 h-3 w-3 rounded-full border border-primary bg-background" />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {getTypeLabel(evidence.type)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(
                              new Date(evidence.created_at),
                              "dd/MM/yyyy HH:mm"
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Người đăng: {evidence.user?.name}
                        </p>
                        {evidence.note && (
                          <p className="text-sm mt-2 bg-muted p-2 rounded">
                            {evidence.note}
                          </p>
                        )}
                      </div>
                      <div className="w-full sm:w-48 shrink-0">
                        {evidence.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video
                            src={evidence.media_url}
                            controls
                            className="w-full rounded-md border"
                          />
                        ) : (
                          <a
                            href={evidence.media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={evidence.media_url}
                              alt="Evidence"
                              className="w-full rounded-md border object-cover h-32"
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Chưa có bằng chứng nào được tải lên.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
