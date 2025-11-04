"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import {
  useMutation,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageCircle, X, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { chatDisplayName, formatConversationDate } from "@/lib/utils-chat";
import {
  ChatConversation,
  ChatMessage,
  ChatMessagesResponse,
  ChatStreamResult,
} from "@/lib/types";
import {
  createChatConversation,
  getChatConversations,
  getChatMessages,
  streamChatMessage,
  type StreamChatMessageParams,
} from "@/services/chat";

const MESSAGE_PAGE_SIZE = 30;

export function ChatWidget() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    []
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const authToken =
    typeof window !== "undefined" ? Cookies.get("auth_token") : undefined;

  const isAuthenticated = !!authToken;

  const conversationsQuery = useQuery({
    queryKey: ["chat-conversations"],
    queryFn: () => getChatConversations(),
    enabled: isOpen && isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const conversations = useMemo<ChatConversation[]>(
    () => conversationsQuery.data?.data ?? [],
    [conversationsQuery.data]
  );

  useEffect(() => {
    if (!isOpen || !isAuthenticated) {
      return;
    }

    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [isOpen, isAuthenticated, conversations, selectedConversationId]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedConversationId(null);
      setOptimisticMessages([]);
      setInputValue("");
    }
  }, [isOpen]);

  useEffect(() => {
    setOptimisticMessages([]);
  }, [selectedConversationId]);

  const messagesQuery = useInfiniteQuery<
    ChatMessagesResponse,
    Error,
    InfiniteData<ChatMessagesResponse, number | undefined>,
    [string, number | null],
    number | undefined
  >({
    queryKey: ["chat-messages", selectedConversationId],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }): Promise<ChatMessagesResponse> => {
      if (!selectedConversationId) {
        return {
          data: [] as ChatMessage[],
          meta: {
            has_more: false,
            next_before_id: null,
            limit: MESSAGE_PAGE_SIZE,
          },
        } satisfies ChatMessagesResponse;
      }

      return getChatMessages(selectedConversationId, {
        before_id: typeof pageParam === "number" ? pageParam : undefined,
        limit: MESSAGE_PAGE_SIZE,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more
        ? lastPage.meta.next_before_id ?? undefined
        : undefined,
    enabled: isOpen && isAuthenticated && !!selectedConversationId,
    refetchOnWindowFocus: false,
  });

  const combinedMessages = useMemo<ChatMessage[]>(() => {
    const persisted =
      messagesQuery.data?.pages.flatMap((page) => page.data) ?? [];
    const all = [...persisted, ...optimisticMessages];

    return all.sort((a, b) => {
      const aTime = a.created_at ? Date.parse(a.created_at) : 0;
      const bTime = b.created_at ? Date.parse(b.created_at) : 0;
      if (aTime === bTime) {
        return a.id - b.id;
      }
      return aTime - bTime;
    });
  }, [messagesQuery.data, optimisticMessages]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const node = scrollContainerRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [combinedMessages, isOpen, messagesQuery.status]);

  const createConversationMutation = useMutation({
    mutationFn: () => createChatConversation(),
    onSuccess: async (conversation) => {
      await queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
      setSelectedConversationId(conversation.id);
      queryClient.removeQueries({
        queryKey: ["chat-messages", conversation.id],
      });
    },
    onError: () => {
      toast.error("Không thể tạo cuộc trò chuyện mới. Vui lòng thử lại.");
    },
  });

  const sendMessageMutation = useMutation<
    ChatStreamResult,
    Error,
    StreamChatMessageParams
  >({
    mutationFn: (params) => streamChatMessage(params),
  });

  const handleSend = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const trimmed = inputValue.trim();
    if (!trimmed || sendMessageMutation.isPending) {
      return;
    }

    const nowIso = new Date().toISOString();
    const tempId = Date.now();
    const assistantTempId = tempId + 1;

    const optimisticMessage: ChatMessage = {
      id: tempId,
      conversation_id: selectedConversationId ?? 0,
      role: "user",
      content: trimmed,
      metadata: null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const optimisticAssistant: ChatMessage = {
      id: assistantTempId,
      conversation_id: selectedConversationId ?? 0,
      role: "assistant",
      content: "",
      metadata: null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    setOptimisticMessages((prev) => [
      ...prev,
      optimisticMessage,
      optimisticAssistant,
    ]);
    setInputValue("");

    let errorHandled = false;

    try {
      const response = await sendMessageMutation.mutateAsync({
        payload: {
          conversation_id: selectedConversationId ?? undefined,
          message: trimmed,
        },
        onConversation: (conversationId) => {
          setSelectedConversationId((prev) => prev ?? conversationId);
          setOptimisticMessages((prev) =>
            prev.map((item) =>
              item.id === tempId || item.id === assistantTempId
                ? { ...item, conversation_id: conversationId }
                : item
            )
          );
        },
        onDelta: (chunk) => {
          setOptimisticMessages((prev) =>
            prev.map((item) =>
              item.id === assistantTempId
                ? { ...item, content: `${item.content}${chunk}` }
                : item
            )
          );
        },
        onDone: (payload) => {
          setOptimisticMessages((prev) =>
            prev.map((item) =>
              item.id === assistantTempId
                ? {
                    ...item,
                    conversation_id: payload.conversation_id,
                    content: payload.message,
                    metadata: payload.metadata,
                  }
                : item
            )
          );
        },
        onError: (message) => {
          errorHandled = true;
          toast.error(message);
        },
      });

      const newConversationId = response.conversation_id;
      setSelectedConversationId(newConversationId);

      await queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
      await queryClient.invalidateQueries({
        queryKey: ["chat-messages", newConversationId],
      });
      setOptimisticMessages((prev) =>
        prev.filter((item) => item.id !== tempId && item.id !== assistantTempId)
      );
    } catch (error) {
      if (!errorHandled) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể gửi tin nhắn. Vui lòng thử lại.";
        toast.error(message);
      }
      setOptimisticMessages((prev) =>
        prev.filter((item) => item.id !== tempId && item.id !== assistantTempId)
      );
    }
  };

  const handleToggle = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsOpen((prev) => !prev);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSend();
  };

  const isLoadingConversations =
    conversationsQuery.isLoading || conversationsQuery.isFetching;
  const isLoadingMessages = messagesQuery.isLoading || messagesQuery.isFetching;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="flex h-152 w-86 flex-col overflow-hidden rounded-2xl border bg-background shadow-xl sm:w-[24rem]">
          <header className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="text-sm font-semibold">Trợ lý ReRent AI</p>
              <p className="text-xs opacity-80">
                {sendMessageMutation.isPending
                  ? "Đang tạo phản hồi..."
                  : "Sẵn sàng hỗ trợ bạn"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-sm">
            <Select
              disabled={isLoadingConversations || conversations.length === 0}
              value={
                selectedConversationId
                  ? String(selectedConversationId)
                  : undefined
              }
              onValueChange={(value) =>
                setSelectedConversationId(Number(value))
              }
            >
              <SelectTrigger className="h-9 text-xs flex-1">
                <SelectValue
                  placeholder={
                    isLoadingConversations
                      ? "Đang tải..."
                      : "Chọn cuộc trò chuyện"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-60 text-sm">
                {conversations.map((conversation) => (
                  <SelectItem
                    key={conversation.id}
                    value={String(conversation.id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {chatDisplayName(conversation)}
                      </span>
                      {conversation.last_message_at && (
                        <span className="text-xs text-muted-foreground">
                          {formatConversationDate(conversation.last_message_at)}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => createConversationMutation.mutate()}
                  disabled={createConversationMutation.isPending}
                >
                  {createConversationMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tạo cuộc trò chuyện mới</TooltipContent>
            </Tooltip>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex-1 space-y-3 overflow-y-auto bg-muted/10 px-3 py-4"
          >
            {messagesQuery.hasNextPage && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => messagesQuery.fetchNextPage()}
                  disabled={messagesQuery.isFetchingNextPage}
                >
                  {messagesQuery.isFetchingNextPage
                    ? "Đang tải..."
                    : "Xem thêm tin cũ"}
                </Button>
              </div>
            )}

            {isLoadingMessages && combinedMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Đang tải hội thoại...
              </div>
            ) : combinedMessages.length === 0 ? (
              <div className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
                Chưa có tin nhắn. Hãy gửi câu hỏi đầu tiên của bạn!
              </div>
            ) : (
              combinedMessages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={`${message.id}-${message.role}`}
                    className={cn(
                      "flex",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow",
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                  Trợ lý đang trả lời...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t bg-background px-3 py-3"
          >
            <Textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Nhập câu hỏi của bạn..."
              rows={2}
              className="resize-none text-sm"
              disabled={sendMessageMutation.isPending}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Nhấn Enter để gửi, Shift + Enter để xuống dòng</span>
              <Button
                type="submit"
                size="sm"
                disabled={sendMessageMutation.isPending || !inputValue.trim()}
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Gửi
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          className="flex items-center gap-2 rounded-full shadow-lg"
          onClick={handleToggle}
        >
          <MessageCircle className="h-5 w-5" />
          Trò chuyện
        </Button>
      )}
    </div>
  );
}
