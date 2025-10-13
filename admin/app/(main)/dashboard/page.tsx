"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminDashboard,
  type DashboardResponse,
  type OrderStatusPoint,
} from "@/services/dashboard";

const emptyStats = {
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: "0",
  pendingOrders: 0,
};

const emptyDashboard = {
  stats: emptyStats,
  revenueData: [],
  orderStatusData: [],
  topProductsData: [],
  userGrowthData: [],
} as DashboardResponse;

export default function AdminDashboard() {
  const {
    data: dashboard,
    isLoading,
    error,
  } = useQuery<DashboardResponse>({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const data = dashboard ?? emptyDashboard;
  const stats = data.stats;

  const revenueData = data.revenueData.length
    ? data.revenueData
    : [
        { month: "T7", revenue: 0, orders: 0 },
        { month: "T8", revenue: 0, orders: 0 },
        { month: "T9", revenue: 0, orders: 0 },
        { month: "T10", revenue: 0, orders: 0 },
        { month: "T11", revenue: 0, orders: 0 },
        { month: "T12", revenue: 0, orders: 0 },
      ];

  const orderStatusData = data.orderStatusData.length
    ? data.orderStatusData
    : [
        { status: "Chờ xác nhận", value: 0, color: "var(--chart-1)" },
        { status: "Đã xác nhận", value: 0, color: "var(--chart-2)" },
        { status: "Đang giao", value: 0, color: "var(--chart-3)" },
        { status: "Hoàn thành", value: 0, color: "var(--chart-4)" },
        { status: "Đã hủy", value: 0, color: "var(--chart-5)" },
      ];

  const topProductsData = data.topProductsData.length
    ? data.topProductsData
    : [];

  const userGrowthData = data.userGrowthData.length
    ? data.userGrowthData
    : [
        { month: "T7", users: 0 },
        { month: "T8", users: 0 },
        { month: "T9", users: 0 },
        { month: "T10", users: 0 },
        { month: "T11", users: 0 },
        { month: "T12", users: 0 },
      ];

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Lỗi tải dữ liệu bảng điều khiển:{" "}
        {error instanceof Error ? error.message : "Lỗi không xác định"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Tất cả người dùng trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Đơn hàng đã tạo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đơn chờ xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý ngay</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <p className="text-sm text-muted-foreground">6 tháng gần nhất</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Doanh thu",
                  color: "var(--chart-1)",
                },
                orders: {
                  label: "Đơn hàng",
                  color: "var(--chart-2)",
                },
              }}
              className="h-[300px]"
            >
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis
                  className="text-xs"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => {
                    if (name === "revenue") {
                      return [formatCurrency(value), "Doanh thu"];
                    }
                    return [value, "Đơn hàng"];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng theo trạng thái</CardTitle>
            <p className="text-sm text-muted-foreground">Phân bổ trạng thái</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                pending: { label: "Chờ xác nhận", color: "var(--chart-1)" },
                confirmed: { label: "Đã xác nhận", color: "var(--chart-2)" },
                shipping: { label: "Đang giao", color: "var(--chart-3)" },
                completed: { label: "Hoàn thành", color: "var(--chart-4)" },
                cancelled: { label: "Đã hủy", color: "var(--chart-5)" },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) =>
                    `${status}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map(
                    (entry: OrderStatusPoint, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    )
                  )}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and User Growth */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <p className="text-sm text-muted-foreground">Top 5 sản phẩm</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Số lượng bán",
                  color: "var(--chart-3)",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  className="text-xs"
                  tickFormatter={(value) =>
                    value.length > 20 ? value.substring(0, 20) + "..." : value
                  }
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string, props: any) => {
                    if (name === "sales") {
                      return [
                        <div key="tooltip" className="space-y-1">
                          <div>Đã bán: {value}</div>
                          <div>
                            Doanh thu: {formatCurrency(props.payload.revenue)}
                          </div>
                        </div>,
                        "",
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="var(--chart-3)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
            <p className="text-sm text-muted-foreground">6 tháng gần nhất</p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: {
                  label: "Người dùng",
                  color: "var(--chart-4)",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  dot={{ fill: "var(--chart-4)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
