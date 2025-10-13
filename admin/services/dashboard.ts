import axiosInstance from "@/lib/axiosInstance";

export type Stats = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: string;
  pendingOrders: number;
};

export type RevenuePoint = { month: string; revenue: number; orders: number };
export type OrderStatusPoint = { status: string; value: number; color: string };
export type TopProduct = { name: string; sales: number; revenue: number };
export type UserGrowthPoint = { month: string; users: number };

export type DashboardResponse = {
  stats: Stats;
  revenueData: RevenuePoint[];
  orderStatusData: OrderStatusPoint[];
  topProductsData: TopProduct[];
  userGrowthData: UserGrowthPoint[];
};

export const getAdminDashboard = async (): Promise<DashboardResponse> => {
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`
  );
  return res.data;
};
