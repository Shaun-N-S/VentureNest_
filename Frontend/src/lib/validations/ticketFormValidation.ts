import { z } from "zod";
import { TicketStage } from "../../types/ticket";

export const createTicketSchema = z.object({
  projectId: z.string().min(1, "Project is required"),

  sessionName: z.string().min(3, "Session name must be at least 3 characters"),

  discussionLevel: z.nativeEnum(TicketStage),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),

  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),

  duration: z.number().min(15).max(180),

  description: z.string().max(500).optional(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
