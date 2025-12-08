"use client";

import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";

export function FacebookLoginButton() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook/redirect`;
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
      <Facebook className="mr-2 h-4 w-4" />
      Đăng nhập với Facebook
    </Button>
  );
}
