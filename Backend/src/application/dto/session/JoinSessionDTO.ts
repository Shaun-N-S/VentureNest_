export interface JoinSessionDTO {
  sessionId: string;
  userId: string;
}

export interface JoinSessionResponseDTO {
  role: "host" | "waiting";
}
