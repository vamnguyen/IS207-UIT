"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2, Reply } from "lucide-react";
import type { Comment } from "@/lib/types";
import { Role } from "@/lib/enum";
import { formatDate, getInitials } from "@/lib/utils";

// Mock data
const mockComments: Comment[] = [
  {
    id: 1,
    content: "Sản phẩm rất tốt, tôi rất hài lòng!",
    user_id: 1,
    product_id: 1,
    left: 1,
    right: 2,
    parent_id: null,
    edited: false,
    edited_at: null,
    created_at: "2024-03-01T10:30:00Z",
    updated_at: "2024-03-01T10:30:00Z",
    user: {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: Role.CUSTOMER,
      address: "123 Đường ABC, Quận 1, TP.HCM",
      avatar_url: null,
      created_at: "2024-01-15T10:30:00Z",
    },
    parent: null,
  },
  {
    id: 2,
    content: "Giao hàng nhanh, đóng gói cẩn thận.",
    user_id: 2,
    product_id: 1,
    left: 3,
    right: 6,
    parent_id: null,
    edited: false,
    edited_at: null,
    created_at: "2024-03-02T14:20:00Z",
    updated_at: "2024-03-02T14:20:00Z",
    user: {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      role: Role.CUSTOMER,
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      avatar_url: null,
      created_at: "2024-02-20T14:20:00Z",
    },
    parent: null,
  },
  {
    id: 3,
    content: "Cảm ơn bạn đã ủng hộ!",
    user_id: 3,
    product_id: 1,
    left: 4,
    right: 5,
    parent_id: 2,
    edited: false,
    edited_at: null,
    created_at: "2024-03-02T15:30:00Z",
    updated_at: "2024-03-02T15:30:00Z",
    user: {
      id: 3,
      name: "Cửa hàng A",
      email: "shopa@example.com",
      role: Role.SHOP,
      address: null,
      avatar_url: null,
      created_at: "2024-01-15T10:30:00Z",
    },
    parent: {
      id: 2,
      content: "Giao hàng nhanh, đóng gói cẩn thận.",
      user_id: 2,
      product_id: 1,
      left: 3,
      right: 6,
      parent_id: null,
      edited: false,
      edited_at: null,
      created_at: "2024-03-02T14:20:00Z",
      updated_at: "2024-03-02T14:20:00Z",
      user: {
        id: 2,
        name: "Trần Thị B",
        email: "tranthib@example.com",
        role: Role.CUSTOMER,
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        avatar_url: null,
        created_at: "2024-02-20T14:20:00Z",
      },
      parent: null,
    },
  },
  {
    id: 4,
    content: "Chất lượng không như mong đợi, cần cải thiện.",
    user_id: 4,
    product_id: 2,
    left: 7,
    right: 8,
    parent_id: null,
    edited: true,
    edited_at: "2024-03-03T11:00:00Z",
    created_at: "2024-03-03T10:15:00Z",
    updated_at: "2024-03-03T11:00:00Z",
    user: {
      id: 4,
      name: "Lê Văn C",
      email: "levanc@example.com",
      role: Role.CUSTOMER,
      address: "789 Đường DEF, Quận 3, TP.HCM",
      avatar_url: null,
      created_at: "2024-03-10T09:15:00Z",
    },
    parent: null,
  },
];

// Mock products for display
const mockProducts: Record<number, { id: number; name: string }> = {
  1: { id: 1, name: "Laptop Dell XPS 15" },
  2: { id: 2, name: "Áo thun nam" },
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState("");

  const handleEdit = (comment: Comment) => {
    setSelectedComment(comment);
    setEditContent(comment.content);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (comment: Comment) => {
    setSelectedComment(comment);
    setIsDeleteDialogOpen(true);
  };

  const confirmEdit = () => {
    if (selectedComment) {
      setComments(
        comments.map((c) =>
          c.id === selectedComment.id
            ? {
                ...c,
                content: editContent,
                edited: true,
                edited_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  const confirmDelete = () => {
    if (selectedComment) {
      setComments(comments.filter((c) => c.id !== selectedComment.id));
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý bình luận</h1>
        <p className="text-muted-foreground">
          Kiểm duyệt và quản lý bình luận của người dùng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bình luận ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trả lời</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => {
                const product = mockProducts[comment.product_id];
                const isReply = comment.parent_id !== null;

                return (
                  <TableRow key={comment.id}>
                    <TableCell className="font-medium">{comment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={comment.user.avatar_url || undefined}
                          />
                          <AvatarFallback>
                            {getInitials(comment.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{comment.user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {comment.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {comment.product_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="line-clamp-2 text-sm">
                          {comment.content}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isReply ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Reply className="h-3 w-3" />
                          <span>Trả lời #{comment.parent_id}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {comment.edited ? (
                        <Badge variant="secondary">Đã chỉnh sửa</Badge>
                      ) : (
                        <Badge variant="outline">Gốc</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(comment.created_at)}</div>
                        {comment.edited && comment.edited_at && (
                          <div className="text-xs text-muted-foreground">
                            Sửa: {formatDate(comment.edited_at)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(comment)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(comment)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
            <DialogDescription>
              Cập nhật nội dung bình luận của người dùng
            </DialogDescription>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedComment.user.avatar_url || undefined}
                    />
                    <AvatarFallback>
                      {getInitials(selectedComment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">
                      {selectedComment.user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(selectedComment.created_at)}
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  <strong>Sản phẩm:</strong>{" "}
                  {mockProducts[selectedComment.product_id]?.name}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung bình luận</Label>
                <Textarea
                  id="content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  placeholder="Nhập nội dung bình luận"
                />
              </div>
            </div>
          )}
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
              Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedComment && (
            <div className="rounded-lg border bg-muted p-3">
              <div className="mb-2 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={selectedComment.user.avatar_url || undefined}
                  />
                  <AvatarFallback>
                    {getInitials(selectedComment.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">
                    {selectedComment.user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(selectedComment.created_at)}
                  </div>
                </div>
              </div>
              <p className="text-sm">{selectedComment.content}</p>
            </div>
          )}
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
    </div>
  );
}
