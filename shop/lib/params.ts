import { Role } from "./enum";

export type registerParams = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: Role;
};

export type loginParams = {
  email: string;
  password: string;
};

export type getCommentsParams = {
  product_id: number;
  parent_id?: number | null;
  page?: number;
  limit?: number;
};

export type createCommentParams = {
  product_id: number;
  content: string;
  parent_id?: number | null;
};

export type updateCommentParams = {
  content: string;
  product_id: number;
};

export type changePasswordParams = {
  current_password?: string;
  password: string;
  password_confirmation: string;
};

export type forgotPasswordParams = {
  email: string;
};

export type resetPasswordParams = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
};
