import axiosInstance from "@/lib/axiosInstance";
import { getCommentsParams, createCommentParams } from "@/lib/params";
import { GetCommentsResponse, CreateCommentResponse } from "@/lib/response";

export const getComments = async (
  data: getCommentsParams
): Promise<GetCommentsResponse> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/comments`,
    {
      params: data,
    }
  );
  return response.data;
};

export const createComment = async (
  data: createCommentParams
): Promise<CreateCommentResponse> => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/comments`,
    data
  );
  return response.data;
};

export const deleteComment = async (id: number, productId: number) => {
  const response = await axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`,
    {
      data: {
        product_id: productId,
      },
    }
  );
  return response.data;
};
