"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  CheckCircle,
  HomeIcon,
  KeyRound, // Icon chìa khóa
} from "lucide-react";
import { getCurrentUser } from "@/services/auth";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Import Form đổi mật khẩu
import { ChangePasswordForm } from "@/components/profile/change-password-form";

export function ProfileClient() {
  // State quản lý việc sửa thông tin cá nhân
  const [isEditing, setIsEditing] = useState(false);
  
  // State quản lý việc ẩn/hiện form đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Ref để tự động cuộn xuống khi mở form đổi pass
  const passwordFormRef = useRef<HTMLDivElement>(null);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Lấy thông tin user hiện tại
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!Cookies.get("auth_token"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Xử lý khi bấm nút Sửa thông tin
  const handleEdit = () => {
    if (user) {
      setEditData({
        name: user.name,
        email: user.email,
        address: user.address || "",
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ name: "", email: "", address: "" });
  };

  const handleSave = () => {
    // TODO: Gọi API cập nhật thông tin user ở đây
    toast.success("Thông tin đã được cập nhật");
    setIsEditing(false);
  };
  
  // Hàm bật/tắt form đổi mật khẩu và cuộn xuống
  const togglePasswordForm = () => {
    setShowChangePassword(!showChangePassword);
    
    // Nếu hành động là Mở form thì cuộn xuống
    if (!showChangePassword) {
        setTimeout(() => {
            passwordFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }
  };

  // Helper: Chọn màu badge theo role
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "shop": return "default";
      default: return "secondary";
    }
  };

  // Helper: Dịch role sang tiếng Việt
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Quản trị viên";
      case "shop": return "Chủ cửa hàng";
      default: return "Người dùng";
    }
  };

  // Loading View
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
         <span className="text-muted-foreground mt-2 block">Đang tải thông tin...</span>
      </div>
    );
  }

  // Error View
  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-muted-foreground text-center">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Không thể tải thông tin người dùng</p>
              <p className="text-sm mt-2">Vui lòng đăng nhập lại</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main View
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 1. Card Thông tin cơ bản */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cơ bản
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit} className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar và Tên */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            {isEditing ? (
              <Input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                placeholder="Nhập email"
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {user.email}
              </p>
            )}
          </div>

          {/* Địa chỉ */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Địa chỉ
            </Label>
            {isEditing ? (
              <Input
                type="address"
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {user.address || "Chưa cập nhật"}
              </p>
            )}
          </div>

          {/* Ngày tham gia */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ngày tham gia
            </Label>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {format(new Date(user.created_at), "dd/MM/yyyy", {
                locale: vi,
              })}
            </p>
          </div>

          {/* Nút Lưu/Hủy khi đang Edit */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Lưu thay đổi
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Card Trạng thái tài khoản */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Trạng thái tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Tài khoản hoạt động
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Tài khoản của bạn đang hoạt động bình thường
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Quyền truy cập
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Thao tác nhanh (Nơi chứa nút bật Form đổi mật khẩu) */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Nút Đổi mật khẩu */}
            <Button 
                variant={showChangePassword ? "secondary" : "outline"}
                className="justify-start h-auto p-4"
                onClick={togglePasswordForm}
            >
              <div className="flex items-start gap-3">
                 <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <KeyRound className="h-5 w-5 text-primary" />
                 </div>
                 <div className="text-left">
                    <p className="font-medium">Đổi mật khẩu</p>
                    <p className="text-sm text-muted-foreground">
                      {showChangePassword ? "Đóng form đổi mật khẩu" : "Cập nhật mật khẩu mới"}
                    </p>
                 </div>
              </div>
            </Button>

            {/* Nút Lịch sử (Placeholder) */}
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-start gap-3">
                 <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                 </div>
                 <div className="text-left">
                    <p className="font-medium">Lịch sử đăng nhập</p>
                    <p className="text-sm text-muted-foreground">
                      Xem hoạt động gần đây
                    </p>
                 </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Form Đổi Mật Khẩu (Chỉ hiện khi bấm nút ở trên) */}
      {showChangePassword && (
        <div ref={passwordFormRef} className="animate-in fade-in slide-in-from-top-4 duration-300">
            <ChangePasswordForm />
            
            <div className="flex justify-end mt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowChangePassword(false)}>
                    Ẩn form đổi mật khẩu
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}