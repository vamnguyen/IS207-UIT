"use client";

import { useState } from "react";
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
} from "lucide-react";
import { getCurrentUser } from "@/services/auth";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { ChangePasswordDialog } from "./change-password-dialog";

export function ProfileClient() {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!Cookies.get("auth_token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

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
    // TODO: Implement update user API
    toast.success("Thông tin đã được cập nhật");
    setIsEditing(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "shop":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "shop":
        return "Chủ cửa hàng";
      default:
        return "Người dùng";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-muted-foreground text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Đang tải...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cơ bản
            </CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Name */}
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
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    placeholder="Nhập họ và tên"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <Badge
                    variant={getRoleBadgeVariant(user.role)}
                    className="mt-1"
                  >
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
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                placeholder="Nhập email"
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {user.email}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Địa chỉ
            </Label>
            {isEditing ? (
              <Input
                type="address"
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
                placeholder="Nhập địa chỉ"
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {user.address || "Chưa cập nhật"}
              </p>
            )}
          </div>

          {/* Join Date */}
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

          {/* Edit Actions */}
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

      {/* Account Status */}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {!user.google_id && !user.facebook_id && (
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => setShowChangePassword(true)}
              >
                <div className="text-left">
                  <p className="font-medium">Đổi mật khẩu</p>
                  <p className="text-sm text-muted-foreground">
                    Cập nhật mật khẩu mới
                  </p>
                </div>
              </Button>
            )}
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Cài đặt thông báo</p>
                <p className="text-sm text-muted-foreground">
                  Quản lý thông báo
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Change Password Dialog */}
      {!user.google_id && !user.facebook_id && (
        <ChangePasswordDialog
          open={showChangePassword}
          onOpenChange={setShowChangePassword}
        />
      )}
    </div>
  );
}
