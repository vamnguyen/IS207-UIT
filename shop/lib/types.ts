import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductStatus,
  Role,
} from "./enum";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  address?: string;
  avatar_url?: string;
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
  id: number;
  product: Product;
  quantity: number;
  start_date: string;
  end_date: string;
  days: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  total_amount: string;
  status: OrderStatus;
  address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: string;
  days: number;
  subtotal: string;
  created_at: string;
  updated_at: string;
  payment: Payment;
}

export interface Payment {
  id: number;
  order_id: number;
  payment_method: PaymentMethod;
  amount: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  product_id: number;
  left: number;
  right: number;
  parent_id: number | null;
  edited: boolean;
  edited_at: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  parent: Comment | null;
}
