export const SessionStatus = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export interface SessionDTO {
  id: string;
  sessionName: string;
  date: string; // ISO
  startTime?: string; // ISO
  duration: number;
  status: SessionStatus;
}

export interface PersonDTO {
  id: string;
  name: string;
  profileImg?: string;
}

export interface ProjectDTO {
  id: string;
  startupName: string;
}

export interface InvestorTicketDTO {
  ticketId: string;
  ticketNumber: string;
  stage: string;
  status: string;
  createdAt: string;

  project: {
    id: string;
    startupName: string;
    coverImageUrl?: string;
    location?: string;
  };

  founder: PersonDTO;
  investor: PersonDTO;

  sessions: SessionDTO[];
}
