import Cookies from "js-cookie";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // Gửi cookie đi kèm request (bắt buộc cho Sanctum)
});

// Request interceptor để thêm Bearer token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để xử lý lỗi 401
axiosInstance.interceptors.response.use(
  (response) => {
    // Nếu request thành công, không làm gì cả
    return response;
  },
  (error) => {
    // Kiểm tra nếu có response lỗi và status là 401
    if (error.response && error.response.status === 401) {
      // Chuyển hướng người dùng về trang đăng nhập
      // Dùng if để chắc chắn code này chỉ chạy trên trình duyệt
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    // Trả về lỗi để các hàm .catch() khác có thể xử lý nếu cần
    return Promise.reject(error);
  }
);

export default axiosInstance;
