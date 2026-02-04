export const TicketStage = {
  EXPLORATORY: "Exploratory Level",
  PRODUCT_EVALUATION: "Product Evaluation",
  BUSINESS_REVIEW: "Business & Financial Review",
  NEGOTIATION: "Investment Negotiation",
} as const;

export type TicketStage = (typeof TicketStage)[keyof typeof TicketStage];

export interface CreateTicketWithSessionPayload {
  projectId: string;
  initialStage: TicketStage;
  sessionName: string;
  date: string;
  startTime: string;
  duration: number;
  description?: string;
}
