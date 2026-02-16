import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createConversation,
  getUserConversations,
  getMessages,
  sendMessage,
  markConversationRead,
  getUnreadCount,
} from "../../services/Chat/chatService";
import type { UserRole } from "../../types/UserRole";
import type { MessageType } from "../../types/messageType";

/* ---------------------- Create Conversation ---------------------- */
export const useCreateConversation = () => {
  return useMutation({
    mutationFn: ({
      targetUserId,
      targetUserRole,
    }: {
      targetUserId: string;
      targetUserRole: UserRole;
    }) => createConversation(targetUserId, targetUserRole),
  });
};

/* ---------------------- Infinite Conversations ---------------------- */
export const useInfiniteConversations = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["chat-conversations"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getUserConversations(pageParam as number, limit),

    getNextPageParam: (lastPage, pages) =>
      lastPage.conversations.length === limit ? pages.length + 1 : undefined,
  });
};

/* ---------------------- Infinite Messages ---------------------- */
export const useInfiniteMessages = (conversationId: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ["chat-messages", conversationId],
    initialPageParam: 1,
    enabled: !!conversationId,
    queryFn: ({ pageParam }) =>
      getMessages(conversationId, pageParam as number, limit),

    getNextPageParam: (lastPage, pages) =>
      lastPage.messages.length === limit ? pages.length + 1 : undefined,
  });
};

/* ---------------------- Send Message ---------------------- */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
      messageType,
    }: {
      conversationId: string;
      content: string;
      messageType: MessageType;
    }) => sendMessage(conversationId, content, messageType),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat-conversations"],
      });
    },
  });
};

/* ---------------------- Mark Read ---------------------- */
export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      markConversationRead(conversationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat-conversations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["chat-unread-count"],
      });
    },
  });
};

/* ---------------------- Unread Count ---------------------- */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["chat-unread-count"],
    queryFn: getUnreadCount,
  });
};
