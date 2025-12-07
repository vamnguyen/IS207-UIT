"use client";

import { Fragment, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Order } from "@/lib/types";
import { OrderStatus } from "@/lib/enum";
import {
  formatCurrency,
  formatDate,
  getPaymentMethodLabel,
  statusConfig,
  paymentStatusConfig,
} from "@/lib/utils";
import Image from "next/image";
import { getAllOrdersForAdmin, updateOrderStatus } from "@/services/orders";

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getAllOrdersForAdmin,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const previous = queryClient.getQueryData<Order[]>(["orders"]);

      queryClient.setQueryData<Order[] | undefined>(["orders"], (old) =>
        old?.map((o) =>
          o.id === id ? { ...o, status: status as OrderStatus } : o
        )
      );

      return { previous };
    },
    onError: (err, variables, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(["orders"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    mutation.mutate({ id: orderId, status: newStatus });
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-destructive">Lỗi khi tải đơn hàng.</p>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (dateFrom && new Date(order.created_at) < new Date(dateFrom))
      return false;
    if (dateTo && new Date(order.created_at) > new Date(dateTo)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">
          Theo dõi và quản lý tất cả đơn hàng
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={OrderStatus.PENDING}>Chờ xử lý</SelectItem>
                  <SelectItem value={OrderStatus.CONFIRMED}>
                    Đã xác nhận
                  </SelectItem>
                  <SelectItem value={OrderStatus.PROCESSING}>
                    Đang xử lý
                  </SelectItem>
                  <SelectItem value={OrderStatus.SHIPPED}>Đang giao</SelectItem>
                  <SelectItem value={OrderStatus.DELIVERED}>Đã giao</SelectItem>
                  <SelectItem value={OrderStatus.CANCELLED}>Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-from">Từ ngày</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Đến ngày</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày thuê</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const isExpanded = expandedOrderId === order.id;

                return (
                  <Fragment key={order.id}>
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(order.start_date)}</div>
                          <div className="text-muted-foreground">
                            đến {formatDate(order.end_date)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[order.status].variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            paymentStatusConfig[order.payment.status].variant
                          }
                        >
                          {order.payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order.id, value as OrderStatus)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={OrderStatus.PENDING}>
                              Chờ xử lý
                            </SelectItem>
                            <SelectItem value={OrderStatus.CONFIRMED}>
                              Đã xác nhận
                            </SelectItem>
                            <SelectItem value={OrderStatus.PROCESSING}>
                              Đang xử lý
                            </SelectItem>
                            <SelectItem value={OrderStatus.SHIPPED}>
                              Đang giao
                            </SelectItem>
                            <SelectItem value={OrderStatus.DELIVERED}>
                              Đã giao
                            </SelectItem>
                            <SelectItem value={OrderStatus.CANCELLED}>
                              Đã hủy
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row - Order Details */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={9} className="bg-muted/50">
                          <div className="space-y-4 p-4">
                            {/* Order Items */}
                            <div>
                              <h4 className="mb-3 font-semibold">
                                Sản phẩm trong đơn hàng
                              </h4>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-4 rounded-lg border bg-card p-3"
                                  >
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                      <Image
                                        src={
                                          item.product.image_url ||
                                          "/placeholder.svg"
                                        }
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">
                                        {item.product.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Số lượng: {item.quantity} ×{" "}
                                        {formatCurrency(item.price)} ×{" "}
                                        {item.days} ngày
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold">
                                        {formatCurrency(item.subtotal)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Payment & Address Info */}
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="rounded-lg border bg-card p-4">
                                <h4 className="mb-2 font-semibold">
                                  Thông tin thanh toán
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Phương thức:
                                    </span>
                                    <span>
                                      {getPaymentMethodLabel(
                                        order.payment.payment_method
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Số tiền:
                                    </span>
                                    <span className="font-semibold">
                                      {formatCurrency(order.payment.amount)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Trạng thái:
                                    </span>
                                    <Badge
                                      variant={
                                        paymentStatusConfig[
                                          order.payment.status
                                        ].variant
                                      }
                                    >
                                      {order.payment.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="rounded-lg border bg-card p-4">
                                <h4 className="mb-2 font-semibold">
                                  Địa chỉ giao hàng
                                </h4>
                                <p className="text-sm">
                                  {order.address || "Chưa cập nhật"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
