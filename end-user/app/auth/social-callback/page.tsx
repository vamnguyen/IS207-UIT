'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SocialCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [msg, setMsg] = useState("Đang xử lý đăng nhập...");

  useEffect(() => {
    const token = searchParams.get('token');
    const status = searchParams.get('status');
    const message = searchParams.get('message');

    if (status === 'success' && token) {
      // Lưu token vào localStorage (Cho Frontend dùng gọi API)
      localStorage.setItem('token', token);
      localStorage.setItem('authenticated', 'true');
      
      // Lưu Cookie cho Middleware đọc
      document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
      
      console.log(' Login thành công! Cookie đã set:', document.cookie);
      setMsg(" Thành công! Đang vào Dashboard...");
      
      //  Redirect bằng window.location để ép trình duyệt gửi Cookie lên ngay lập tức
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } else {
      //  Login thất bại
      console.error(' Login lỗi:', message);
      setMsg("Đăng nhập thất bại: " + (message || "Lỗi không xác định"));
      
      // Redirect về login
      setTimeout(() => {
        router.push('/login?error=' + encodeURIComponent(message || 'login_failed'));
      }, 2000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <h1 className="text-xl font-semibold">{msg}</h1>
        <p className="text-muted-foreground mt-2">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
}