import { TicketStatus } from "@domain/enum/ticketStatus";
import z from "zod";

export const cancelSessionSchema = z.object({
  reason: z.string().min(5).max(300),
});

export const addSessionFeedbackSchema = z.object({
  feedback: z.string().min(5).max(1000),
  decision: z.nativeEnum(TicketStatus),
});

export const joinSessionSchema = z.object({});

export const approveUserSchema = z.object({
  userId: z.string().min(1),
});
