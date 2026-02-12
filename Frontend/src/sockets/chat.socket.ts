import type { Socket } from "socket.io-client";
import { queryClient } from "../main";
import type { InfiniteData } from "@tanstack/react-query";
import type { MessageDTO, MessageListResponse } from "../types/chat";

export const registerChatSocket = (socket: Socket) => {
  /* ------------------ NEW MESSAGE ------------------ */
  socket.on("chat:new-message", (message: MessageDTO) => {
    console.log(" Realtime message:", message);

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
