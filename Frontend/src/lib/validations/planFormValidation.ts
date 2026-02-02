import { z } from "zod";

export const planFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),

  billing: z.object({
    price: z.number().nonnegative(),
    durationDays: z.number().positive(),
  }),

  limits: z.object({
    projects: z.number().min(0),
    proposalsPerMonth: z.number().min(0),
    meetingRequests: z.number().min(0),
  }),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
