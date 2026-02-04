import z from "zod";
import { TicketStage } from "@domain/enum/ticketStage";

export const createTicketWithSessionSchema = z.object({
  projectId: z.string().min(1),

  sessionName: z.string().min(3),

  initialStage: z.nativeEnum(TicketStage),

  date: z.coerce.date(),

  startTime: z.string().regex(/^\d{2}:\d{2}$/),

  duration: z.number().min(15).max(180),

  description: z.string().max(500).optional(),
});
