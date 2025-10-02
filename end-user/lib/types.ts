import { ProductStatus, Role } from "./enum";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  images?: string[];
  status: ProductStatus;
  category_id: number;
  category?: Category;
  shop_id: number;
  shop?: User;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  start_date: string;
  end_date: string;
  days: number;
  total_price: number;
}

export interface Rental {
  id: number;
  user_id: number;
  user: User;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: "pending" | "confirmed" | "active" | "returned" | "cancelled";
  created_at: string;
  updated_at: string;
  rental_items: RentalItem[];
}

export interface RentalItem {
  id: number;
  rental_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price_per_day: number;
  days: number;
  subtotal: number;
}

export interface Payment {
  id: number;
  rental_id: number;
  payment_method: "cash" | "bank_transfer" | "card";
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
}
