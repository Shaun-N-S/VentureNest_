import { z } from "zod";
import { TicketStage } from "../../types/ticket";

export const createTicketSchema = z.object({
  projectId: z.string().min(1, "Project is required"),

  sessionName: z.string().min(3, "Session name must be at least 3 characters"),

  initialStage: z.nativeEnum(TicketStage),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),

  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),

  duration: z.number().min(15).max(180),

  description: z.string().max(500).optional(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const monthlyReportSchema = z.object({
  month: z.string().min(1, "Please select a month"),
  year: z.string().min(1, "Please select a year"),

  revenue: z.coerce
    .number({ message: "Must be a valid number" })
    .min(0, "Revenue cannot be negative")
    .transform(String),

  expenditure: z.coerce
    .number({ message: "Must be a valid number" })
    .min(0, "Expenditure cannot be negative")
    .transform(String),

  profitLossAmount: z.coerce
    .number({ message: "Must be a valid number" })
    .min(0, "Amount cannot be negative")
    .transform(String),

  profitLossType: z.enum(["profit", "loss"]),

  achievements: z
    .string()
    .min(10, "Please provide at least 10 characters of detail"),

  challenges: z
    .string()
    .min(10, "Please provide at least 10 characters of detail"),

  confirmation: z.literal(true, {
    message: "You must confirm the details are accurate",
  }),
});

export type MonthlyReportFormData = z.infer<typeof monthlyReportSchema>;
