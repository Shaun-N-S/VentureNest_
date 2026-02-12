import { UserRole } from "@domain/enum/userRole";

export interface GetUserConversationsReqDTO {
  userId: string;
  page: number;
  limit: number;
}

export interface GetUserConversationsResDTO {
  conversations: ConversationListItemDTO[];
  total: number;
}

export interface ConversationListItemDTO {
  id: string;

  otherUser: {
    id: string;
    userName: string;
    profileImg?: string;
    role: UserRole;
  };

  lastMessage?: {
    text: string;
    sentAt: Date;
  };
}

export interface PopulatedParticipantDTO {
  userId: string;
  role: UserRole;
  userName: string;
  profileImg?: string;
}

export interface PopulatedConversationRepoDTO {
  _id: string;

  participants: [PopulatedParticipantDTO, PopulatedParticipantDTO];

  lastMessage?: {
    senderId: string;
    text: string;
    sentAt: Date;
  };

  updatedAt: Date;
}
