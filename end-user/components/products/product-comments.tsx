"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SendHorizontal, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { Comment } from "@/lib/types";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth";
import Cookies from "js-cookie";
import { getComments } from "@/services/comments";
import { getInitials } from "@/lib/utils";

interface ProductCommentsProps {
  productId: number;
}

const MAX_NESTING_LEVEL = 3;

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  parentName?: string;
  onReply: (parentCommentId: number, name: string) => void;
  commentMap: Map<number, Comment[]>;
  depth: number;
}

function CommentItem({
  comment,
  replies,
  parentName,
  onReply,
  commentMap,
  depth,
}: CommentItemProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-600";
      case "owner":
        return "text-purple-600";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="flex flex-col">
      {/* Comment itself */}
      <div className="flex items-start gap-3 py-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {getInitials(comment.user.name) || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="bg-muted/50 p-3 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-semibold text-sm ${getRoleColor(
                  comment.user.role
                )}`}
              >
                {comment.user.name}
              </span>
              {comment.user.role === "admin" && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm text-foreground break-words">
              {parentName && (
                <span className="text-primary font-medium">@{parentName} </span>
              )}
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
            <button
              className="text-primary hover:underline font-medium"
              onClick={() => onReply(comment.id, comment.user.name)}
            >
              Trả lời
            </button>
          </div>
        </div>
      </div>

      {/* Display replies with proper nesting */}
      {depth < MAX_NESTING_LEVEL && replies.length > 0 && (
        <div className="ml-12">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={commentMap.get(reply.id) || []}
              parentName={comment.user.name}
              onReply={onReply}
              commentMap={commentMap}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Display replies at same level after max nesting */}
      {depth >= MAX_NESTING_LEVEL && replies.length > 0 && (
        <div className="">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={commentMap.get(reply.id) || []}
              parentName={comment.user.name}
              onReply={onReply}
              commentMap={commentMap}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductComments({ productId }: ProductCommentsProps) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!Cookies.get("auth_token"),
    staleTime: Infinity,
  });
  const { data: productComments } = useQuery({
    queryKey: ["productComments", productId],
    queryFn: () => getComments({ product_id: productId }),
    enabled: !!productId,
    staleTime: 1 * 60 * 60 * 1000, // 1 giờ
  });
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddComment = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    // In a real app, this would call an API
    toast.success("Đã thêm bình luận");
    setNewComment("");
    setReplyTo(null);
  };

  const handleReplyClick = (parentCommentId: number, name: string) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để trả lời");
      return;
    }

    setReplyTo(parentCommentId);
    setNewComment(`@${name} `);
    inputRef.current?.focus();
  };

  // Organize comments with parent-child relationships
  const organizeComments = () => {
    const commentMap = new Map<number, Comment[]>();
    const topLevelComments: Comment[] = [];

    const comments: Comment[] =
      (productComments?.data as unknown as Comment[]) || [];

    comments.forEach((comment) => {
      if (comment.parent_id) {
        if (!commentMap.has(comment.parent_id)) {
          commentMap.set(comment.parent_id, []);
        }
        commentMap.get(comment.parent_id)?.push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });

    return { topLevelComments, commentMap };
  };

  const { topLevelComments, commentMap } = organizeComments();

  return (
    <Card className="mt-16 space-y-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Bình luận
          <span className="text-muted-foreground font-normal">
            ({productComments?.total_data})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Comment Input */}
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user?.name ?? "?")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <Input
              ref={inputRef}
              placeholder={
                user ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận"
              }
              value={newComment}
              onChange={(e) => {
                const value = e.target.value;
                setNewComment(value);

                // Reset replyTo if user removes the @mention
                if (!/^@\w+\s/.test(value)) {
                  setReplyTo(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              className="rounded-2xl"
              disabled={!user}
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                className="rounded-2xl"
                onClick={handleAddComment}
                disabled={!user || !newComment.trim()}
              >
                <SendHorizontal className="h-4 w-4 mr-2" />
                Gửi
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Comments List */}
        <div className="space-y-1">
          {topLevelComments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
            </div>
          ) : (
            topLevelComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={commentMap.get(comment.id) || []}
                onReply={handleReplyClick}
                commentMap={commentMap}
                depth={1}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
