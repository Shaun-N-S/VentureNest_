export interface ApproveUserDTO {
  sessionId: string;
  userId: string;
  investorId: string;
}

export interface ApproveUserResponseDTO {
  approvedUserId: string;
}
