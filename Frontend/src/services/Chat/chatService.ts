import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  ConversationListResponse,
  MessageListResponse,
  CreateConversationResponse,
  SendMessageResponse,
  UnreadCountResponse,
} from "../../types/chat";
import type { MessageType } from "../../types/messageType";
import type { UserRole } from "../../types/UserRole";

export const createConversation = async (
  targetUserId: string,
  targetUserRole: UserRole,
): Promise<CreateConversationResponse> => {
  const response = await AxiosInstance.post(
    API_ROUTES.CHAT.CREATE_CONVERSATION,
    {
      targetUserId,
      targetUserRole,
    },
  );

  return response.data.data;
};

export const getUserConversations = async (
  page: number,
  limit: number,
): Promise<ConversationListResponse> => {
  const response = await AxiosInstance.get(API_ROUTES.CHAT.GET_CONVERSATIONS, {
    params: { page, limit },
  });

  return response.data.data;
};

export const getMessages = async (
  conversationId: string,
  page: number,
  limit: number,
): Promise<MessageListResponse> => {
  const response = await AxiosInstance.get(
    API_ROUTES.CHAT.GET_MESSAGES.replace(":conversationId", conversationId),
    {
      params: { page, limit },
    },
  );

  return response.data.data;
};

export const sendMessage = async (
  conversationId: string,
  content: string,
  messageType: MessageType,
): Promise<SendMessageResponse> => {
  const response = await AxiosInstance.post(API_ROUTES.CHAT.SEND_MESSAGE, {
    conversationId,
    content,
    messageType,
  });

  return response.data.data;
};

export const markConversationRead = async (
  conversationId: string,
): Promise<void> => {
  await AxiosInstance.patch(
    API_ROUTES.CHAT.MARK_READ.replace(":conversationId", conversationId),
  );
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await AxiosInstance.get(API_ROUTES.CHAT.UNREAD_COUNT);

  return response.data.data;
};
