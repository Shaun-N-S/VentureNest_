export const TicketStage = {
  EXPLORATORY: "Exploratory Level",
  PRODUCT_EVALUATION: "Product Evaluation",
  BUSINESS_REVIEW: "Business & Financial Review",
  NEGOTIATION: "Investment Negotiation",
} as const;

export type TicketStage = (typeof TicketStage)[keyof typeof TicketStage];

export interface CreateTicketWithSessionPayload {
  projectId: string;
  discussionLevel: TicketStage;
  sessionName: string;
  date: string; // ISO date string
  startTime: string; // "HH:mm"
  duration: number; // minutes
  description?: string;
}
