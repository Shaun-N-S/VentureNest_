import { z } from "zod";
import { UserRole } from "@domain/enum/userRole";
import { MessageType } from "@domain/enum/messageType";

export const CreateConversationSchema = z.object({
  targetUserId: z.string().min(1, "Target user is required"),

  targetUserRole: z.nativeEnum(UserRole, {
    message: "Invalid target user role",
  }),
});

export const SendMessageSchema = z
  .object({
    conversationId: z.string().min(1, "Conversation ID is required"),

    content: z.string().trim().max(5000, "Message is too long").optional(),

    messageType: z.nativeEnum(MessageType),
  })
  .refine(
    (data) =>
      data.messageType !== MessageType.TEXT || (data.content && data.content.trim().length > 0),
    {
      message: "Message content is required",
      path: ["content"],
    }
  );
