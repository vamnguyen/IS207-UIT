import axiosInstance from "@/lib/axiosInstance";
import { UploadFolder } from "@/lib/enum";

export const uploadFiles = async (files: File[], folder: UploadFolder) => {
  const form = new FormData();
  files.forEach((f) => form.append("files[]", f));

  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/uploads`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
      params: { folder },
    }
  );

  return response.data.urls as string[];
};
