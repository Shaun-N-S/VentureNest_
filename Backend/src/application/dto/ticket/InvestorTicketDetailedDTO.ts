export interface InvestorTicketDetailedDTO {
  ticketId: string;
  ticketNumber: string;
  stage: string;
  status: string;
  createdAt: Date;

  project: {
    id: string;
    startupName: string;
    coverImageUrl?: string;
    location?: string;
  };

  founder: {
    id: string;
    name: string;
    profileImg?: string;
  };

  investor: {
    id: string;
    name: string;
    profileImg?: string;
  };

  sessions: {
    id: string;
    sessionName: string;
    date: Date;
    startTime?: Date;
    duration: number;
    status: string;
  }[];
}
