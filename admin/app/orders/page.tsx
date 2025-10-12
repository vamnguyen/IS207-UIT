"use client";

import { Fragment, useState } from "react";
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
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductStatus,
  Role,
} from "@/lib/enum";
import {
  formatCurrency,
  formatDate,
  getPaymentMethodLabel,
  statusConfig,
  paymentStatusConfig,
} from "@/lib/utils";
import Image from "next/image";

// Mock data
const mockOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    user: {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: Role.CUSTOMER,
      address: "123 Đường ABC, Quận 1, TP.HCM",
      avatar_url: null,
      created_at: "2024-01-15T10:30:00Z",
    },
    start_date: "2024-03-01",
    end_date: "2024-03-05",
    total_amount: "5000000",
    status: OrderStatus.PENDING,
    address: "123 Đường ABC, Quận 1, TP.HCM",
    created_at: "2024-02-25T10:30:00Z",
    updated_at: "2024-02-25T10:30:00Z",
    items: [
      {
        id: 1,
        order_id: 1,
        product_id: 1,
        product: {
          id: 1,
          name: "Laptop Dell XPS 15",
          slug: "laptop-dell-xps-15",
          description: "Laptop cao cấp",
          price: 35000000,
          stock: 10,
          image_url: "/laptop-dell-xps.png",
          status: ProductStatus.IN_STOCK,
          category_id: 1,
          shop_id: 2,
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z",
        },
        quantity: 1,
        price: "1000000",
        days: 5,
        subtotal: "5000000",
        created_at: "2024-02-25T10:30:00Z",
        updated_at: "2024-02-25T10:30:00Z",
      },
    ],
    payment: {
      id: 1,
      order_id: 1,
      payment_method: PaymentMethod.BANK_TRANSFER,
      amount: "5000000",
      status: PaymentStatus.PENDING,
      created_at: "2024-02-25T10:30:00Z",
      updated_at: "2024-02-25T10:30:00Z",
    },
  },
  {
    id: 2,
    user_id: 2,
    user: {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      role: Role.CUSTOMER,
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      avatar_url: null,
      created_at: "2024-02-20T14:20:00Z",
    },
    start_date: "2024-03-10",
    end_date: "2024-03-12",
    total_amount: "500000",
    status: OrderStatus.CONFIRMED,
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    created_at: "2024-03-05T14:20:00Z",
    updated_at: "2024-03-06T09:15:00Z",
    items: [
      {
        id: 2,
        order_id: 2,
        product_id: 2,
        product: {
          id: 2,
          name: "Áo thun nam",
          slug: "ao-thun-nam",
          description: "Áo thun cotton",
          price: 250000,
          stock: 50,
          image_url: "/mens-tshirt.png",
          status: ProductStatus.IN_STOCK,
          category_id: 2,
          shop_id: 3,
          created_at: "2024-02-20T14:20:00Z",
          updated_at: "2024-02-20T14:20:00Z",
        },
        quantity: 2,
        price: "250000",
        days: 3,
        subtotal: "500000",
        created_at: "2024-03-05T14:20:00Z",
        updated_at: "2024-03-05T14:20:00Z",
      },
    ],
    payment: {
      id: 2,
      order_id: 2,
      payment_method: PaymentMethod.CASH,
      amount: "500000",
      status: PaymentStatus.COMPLETED,
      created_at: "2024-03-05T14:20:00Z",
      updated_at: "2024-03-06T09:15:00Z",
    },
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

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
