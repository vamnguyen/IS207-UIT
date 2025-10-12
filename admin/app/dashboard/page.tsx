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
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data - replace with actual API calls
const stats = {
  totalUsers: 1234,
  totalOrders: 567,
  totalRevenue: "125000000",
  pendingOrders: 23,
};

// Revenue data for area chart (last 6 months)
const revenueData = [
  { month: "T7", revenue: 18500000, orders: 45 },
  { month: "T8", revenue: 22300000, orders: 58 },
  { month: "T9", revenue: 19800000, orders: 52 },
  { month: "T10", revenue: 25600000, orders: 67 },
  { month: "T11", revenue: 28900000, orders: 73 },
  { month: "T12", revenue: 32400000, orders: 89 },
];

// Order status distribution for pie chart
const orderStatusData = [
  { status: "Chờ xác nhận", value: 23, color: "var(--chart-1)" },
  { status: "Đã xác nhận", value: 45, color: "var(--chart-2)" },
  { status: "Đang giao", value: 67, color: "var(--chart-3)" },
  { status: "Hoàn thành", value: 389, color: "var(--chart-4)" },
  { status: "Đã hủy", value: 43, color: "var(--chart-5)" },
];

// Top products for bar chart
const topProductsData = [
  { name: "Laptop Dell XPS 13", sales: 45, revenue: 67500000 },
  { name: "iPhone 15 Pro", sales: 38, revenue: 45600000 },
  { name: "Samsung Galaxy S24", sales: 32, revenue: 28800000 },
  { name: "MacBook Air M2", sales: 28, revenue: 39200000 },
  { name: "iPad Pro", sales: 25, revenue: 22500000 },
];

// User growth for line chart
const userGrowthData = [
  { month: "T7", users: 856 },
  { month: "T8", users: 923 },
  { month: "T9", users: 1005 },
  { month: "T10", users: 1089 },
  { month: "T11", users: 1167 },
  { month: "T12", users: 1234 },
];

export default function AdminDashboard() {
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
              {stats.totalUsers.toLocaleString()}
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
              {stats.totalOrders.toLocaleString()}
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
              {formatCurrency(stats.totalRevenue)}
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
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
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
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
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
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height="100%">
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
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
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
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
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
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
