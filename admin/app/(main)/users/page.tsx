"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateUserRole, deleteUser } from "@/services/users";
import type { PaginatedResponse } from "@/lib/response";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Eye, Pencil, Trash2, Search, Plus } from "lucide-react";
import type { User } from "@/lib/types";
import { Role } from "@/lib/enum";
import { formatDate, getInitials } from "@/lib/utils";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: usersPage, isLoading } = useQuery<
    PaginatedResponse<User>,
    Error
  >({
    queryKey: ["adminUsers", page],
    queryFn: () => getAdminUsers(page, 20),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const mutateUpdateRole = useMutation({
    mutationFn: (payload: { id: number; role: string }) =>
      updateUserRole(payload.id, payload.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const mutateDeleteUser = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const users = usersPage?.data ?? [];
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role>(Role.CUSTOMER);

  const [searchQuery, setSearchQuery] = useState('');

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmEdit = () => {
    if (selectedUser) {
      mutateUpdateRole.mutate({ id: selectedUser.id, role: editRole });
      setIsEditDialogOpen(false);
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      mutateDeleteUser.mutate(selectedUser.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "default";
      case Role.SHOP:
        return "secondary";
      case Role.CUSTOMER:
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "Quản trị viên";
      case Role.SHOP:
        return "Cửa hàng";
      case Role.CUSTOMER:
        return "Khách hàng";
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'bg-[#2c6c24] text-white';
      case Role.SHOP:
        return 'bg-[#7aa520] text-white';
      case Role.CUSTOMER:
        return 'bg-[#cddd77] text-[#1f1f1f]';
      default:
        return 'bg-[#e8eabc] text-[#1f1f1f]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#1f1f1f] mb-2 font-bold">Quản lý người dùng</h1>
          <p className="text-gray-600">
            Danh sách tất cả người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e8eabc] p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7aa520]" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-gray-600 w-full pl-10 pr-4 py-2.5 border border-[#e8eabc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7aa520] focus:border-transparent"
            />
          </div>
          <button className="bg-gradient-to-r from-[#2c6c24] to-[#7aa520] text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2">
            <Plus size={20} />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-sm text-[#7aa520]">{user.id}</TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#cddd77] to-[#7aa520] flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-[#1f1f1f]">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    
                  </TableCell>
                  <TableCell><span className="text-sm text-gray-600">{formatDate(user.created_at)}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon" className="text-[#2c6c24]"
                        onClick={() => handleView(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                          <Button
                            variant="ghost"
                            size="icon" className="text-[#7aa520]"
                            onClick={() => handleEdit(user)}
                          >
                        
                          <Pencil className="h-4 w-4" />
                        </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon" className="text-red-500"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback>
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <Label>Vai trò</Label>
                  <div className="mt-1">
                    <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                      {getRoleLabel(selectedUser.role)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Địa chỉ</Label>
                  <p className="mt-1 text-sm">
                    {selectedUser.address || "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <Label>Ngày tạo</Label>
                  <p className="mt-1 text-sm">
                    {formatDate(selectedUser.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa vai trò</DialogTitle>
            <DialogDescription>
              Thay đổi vai trò của người dùng {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={editRole}
                onValueChange={(value) => setEditRole(value as Role)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.CUSTOMER}>Khách hàng</SelectItem>
                  <SelectItem value={Role.SHOP}>Cửa hàng</SelectItem>
                  <SelectItem value={Role.ADMIN}>Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={confirmEdit}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{selectedUser?.name}</strong>? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị <span className="text-[#2c6c24]">1-8</span> trong tổng số <span className="text-[#2c6c24]">12</span> người dùng
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-[#e8eabc] rounded-lg hover:bg-[#e8eabc]/50 transition-colors duration-150">
            Trước
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#2c6c24] to-[#7aa520] text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 border border-[#e8eabc] rounded-lg hover:bg-[#e8eabc]/50 transition-colors duration-150">
            2
          </button>
          <button className="px-4 py-2 border border-[#e8eabc] rounded-lg hover:bg-[#e8eabc]/50 transition-colors duration-150">
            Sau
          </button>
        </div>
      </div>

    </div>
  );
}
