import { UserRole } from "@domain/enum/userRole";

export interface CreateConversationReqDTO {
  currentUserId: string;
  currentUserRole: UserRole;

  targetUserId: string;
  targetUserRole: UserRole;
}

export interface CreateConversationResDTO {
  conversationId: string;
}
