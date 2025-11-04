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
  address: string | null;
  avatar_url: string | null;
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
  user: User;
  start_date: string;
  end_date: string;
  total_amount: string;
  status: OrderStatus;
  address: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payment: Payment;
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

export type ProductFilters = {
  min_price?: number;
  max_price?: number;
  categories?: number[];
  status?: string[];
  q?: string;
  sort?: string;
};

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: ChatRole;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ChatConversationLatestMessage {
  id: number;
  role: ChatRole;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
}

export interface ChatConversation {
  id: number;
  title: string | null;
  last_message_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  messages_count: number;
  latest_message: ChatConversationLatestMessage | null;
}

export interface ChatConversationsResponse {
  data: ChatConversation[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ChatMessagesResponse {
  data: ChatMessage[];
  meta: {
    has_more: boolean;
    next_before_id: number | null;
    limit: number;
  };
}

export type ChatStreamEvent =
  | {
      event: "conversation";
      conversation_id: number;
    }
  | {
      event: "delta";
      conversation_id: number;
      content: string;
    }
  | {
      event: "done";
      conversation_id: number;
      message: string;
      metadata: Record<string, unknown> | null;
      usage: Record<string, unknown> | null;
    }
  | {
      event: "error";
      conversation_id: number;
      message: string;
    };

export interface ChatStreamResult {
  conversation_id: number;
  message: string;
  metadata: Record<string, unknown> | null;
  usage: Record<string, unknown> | null;
}
