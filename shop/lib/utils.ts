import { clsx, type ClassValue } from "clsx";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { OrderStatus, PaymentStatus } from "./enum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Minimum 1 day
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const statusConfig: Record<
  OrderStatus,
  {
    label: OrderStatus;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: any;
  }
> = {
  pending: { label: OrderStatus.PENDING, variant: "secondary", icon: Clock },
  confirmed: {
    label: OrderStatus.CONFIRMED,
    variant: "default",
    icon: CheckCircle,
  },
  processing: {
    label: OrderStatus.PROCESSING,
    variant: "default",
    icon: Package,
  },
  shipped: { label: OrderStatus.SHIPPED, variant: "default", icon: Truck },
  delivered: {
    label: OrderStatus.DELIVERED,
    variant: "default",
    icon: CheckCircle,
  },
  cancelled: {
    label: OrderStatus.CANCELLED,
    variant: "destructive",
    icon: XCircle,
  },
  returned: {
    label: OrderStatus.RETURNED,
    variant: "destructive",
    icon: XCircle,
  },
};

export const paymentStatusConfig: Record<
  PaymentStatus,
  {
    label: PaymentStatus;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: PaymentStatus.PENDING, variant: "secondary" },
  completed: { label: PaymentStatus.COMPLETED, variant: "default" },
  failed: { label: PaymentStatus.FAILED, variant: "destructive" },
};
