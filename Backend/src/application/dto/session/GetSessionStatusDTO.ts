export interface GetSessionStatusDTO {
  sessionId: string;
  userId: string;
}

export interface GetSessionStatusResponseDTO {
  role: "host" | "waiting" | "allowed";
  hostJoined: boolean;
}
