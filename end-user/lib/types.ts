export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "owner";
  created_at: string;
}

export interface Category {
  id: string;
  category_name: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  product_name: string;
  description: string;
  price_per_day: number;
  stock: number;
  category_id: string;
  category?: Category;
  image_url?: string;
  images?: string[];
  status: "available" | "rented" | "maintenance";
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
  id: string;
  user_id: string;
  user?: User;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: "pending" | "confirmed" | "active" | "returned" | "cancelled";
  created_at: string;
  updated_at: string;
  rental_items: RentalItem[];
}

export interface RentalItem {
  id: string;
  rental_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price_per_day: number;
  days: number;
  subtotal: number;
}

export interface Payment {
  id: string;
  rental_id: string;
  payment_method: "cash" | "bank_transfer" | "card";
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
}
