export type RegisterResponse = {
  access_token: string;
  token_type: string;
  user: {
    name: string;
    email: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
};

export type LoginResponse = {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
};

export type PaginatedResponse<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export type GetCommentsResponse = {
  data: Comment[];
  total_data: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type CreateCommentResponse = {
  content: string;
  user_id: number;
  product_id: number;
  parent_id: number | null;
  left: number;
  right: number;
  updated_at: string;
  created_at: string;
  id: number;
};

export type CheckoutByCardResponse = {
  url: string;
};
