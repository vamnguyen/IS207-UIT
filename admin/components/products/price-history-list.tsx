"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductPriceHistory } from "@/services/products";
import type { ProductPriceHistory } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PriceHistoryListProps {
  productId: number;
}

export default function PriceHistoryList({ productId }: PriceHistoryListProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-price-history", productId],
    queryFn: () => getProductPriceHistory(productId),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">
          Đang tải lịch sử giá...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-4 text-destructive">
        Có lỗi xảy ra khi tải lịch sử giá
      </div>
    );
  }

  const priceHistory = data?.data || [];

  if (priceHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Chưa có thay đổi giá nào được ghi nhận</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Lịch sử thay đổi giá ({priceHistory.length} lần)
      </h4>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">Ngày</TableHead>
              <TableHead>Giá cũ</TableHead>
              <TableHead>Giá mới</TableHead>
              <TableHead>Thay đổi</TableHead>
              <TableHead>Người sửa</TableHead>
              <TableHead>Lý do</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceHistory.map((item: ProductPriceHistory) => {
              const oldPrice = parseFloat(item.old_price);
              const newPrice = parseFloat(item.new_price);
              const changePercent =
                oldPrice > 0
                  ? (((newPrice - oldPrice) / oldPrice) * 100).toFixed(1)
                  : 0;
              const isIncrease = newPrice > oldPrice;

              return (
                <TableRow key={item.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(item.effective_date)}
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground line-through">
                    {formatCurrency(oldPrice)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(newPrice)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={isIncrease ? "destructive" : "default"}
                      className="gap-1"
                    >
                      {isIncrease ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {isIncrease ? "+" : ""}
                      {changePercent}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.changed_by_user ? (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.changed_by_user.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                    {item.reason || "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
