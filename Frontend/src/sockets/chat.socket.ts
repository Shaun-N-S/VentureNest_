import type { Socket } from "socket.io-client";
import { queryClient } from "../main";
import type { InfiniteData } from "@tanstack/react-query";
import type {
  ConversationListResponse,
  ConversationPreview,
  MessageDTO,
  MessageListResponse,
} from "../types/chat";

export const registerChatSocket = (socket: Socket) => {
  /* ------------------ NEW MESSAGE ------------------ */
  socket.on("chat:new-message", (message: MessageDTO) => {
    queryClient.setQueryData<InfiniteData<MessageListResponse>>(
      ["chat-messages", message.conversationId],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index !== 0) return page;

            const exists = page.messages.some((m) => m._id === message._id);

            return {
              ...page,
              messages: exists ? page.messages : [message, ...page.messages],
            };
          }),
        };
      },
    );

    queryClient.invalidateQueries({
      queryKey: ["chat-conversations"],
    });

    queryClient.invalidateQueries({
      queryKey: ["chat-unread-count"],
    });
  });

  /* ------------------ DELIVERED ------------------ */
  socket.on("chat:message-delivered", ({ conversationId }) => {
    queryClient.setQueryData<InfiniteData<MessageListResponse>>(
      ["chat-messages", conversationId],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg: MessageDTO) =>
              msg.status === "SENT" ? { ...msg, status: "DELIVERED" } : msg,
            ),
          })),
        };
      },
    );
  });

  /* ------------------ READ ------------------ */
  socket.on("chat:message-read", ({ conversationId }) => {
    queryClient.setQueryData<InfiniteData<MessageListResponse>>(
      ["chat-messages", conversationId],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg: MessageDTO) =>
              msg.status !== "READ" ? { ...msg, status: "READ" } : msg,
            ),
          })),
        };
      },
    );
  });

  /* ------------------ DELETE ------------------ */
  socket.on("chat:message-deleted", ({ messageId, conversationId }) => {
    /* -------- UPDATE MESSAGES -------- */
    queryClient.setQueryData<InfiniteData<MessageListResponse>>(
      ["chat-messages", conversationId],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg) =>
              msg._id === messageId
                ? { ...msg, isDeleted: true, content: undefined }
                : msg,
            ),
          })),
        };
      },
    );

    /* -------- UPDATE CONVERSATION LAST MESSAGE -------- */
    queryClient.setQueryData<InfiniteData<ConversationListResponse>>(
      ["chat-conversations"],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            conversations: page.conversations.map(
              (conv: ConversationPreview) => {
                if (conv.id !== conversationId) return conv;

                // 👇 IMPORTANT FIX
                if (!conv.lastMessage) return conv;

                return {
                  ...conv,
                  lastMessage: {
                    text: "",
                    sentAt: conv.lastMessage.sentAt,
                  },
                };
              },
            ),
          })),
        };
      },
    );
  });

  /* ------------------ TYPING ------------------ */
  interface TypingPayload {
    userId: string;
    conversationId: string;
  }

  socket.on("chat:user-typing", (payload: TypingPayload) => {
    queryClient.setQueryData(
      ["chat-typing", payload.conversationId],
      payload.userId,
    );
  });

  socket.on("chat:user-stop-typing", (payload: TypingPayload) => {
    queryClient.removeQueries({
      queryKey: ["chat-typing", payload.conversationId],
    });
  });
};
