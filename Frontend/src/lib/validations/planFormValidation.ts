import { z } from "zod";

export const planFormSchema = z.object({
  name: z
    .string()
    .min(3, "Plan name must be at least 3 characters")
    .max(50, "Plan name too long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description too long"),

  billing: z.object({
    price: z
      .number()
      .min(1, "Price must be greater than 0")
      .max(100000, "Price too high"),

    durationDays: z
      .number()
      .min(1, "Duration must be at least 1 day")
      .max(3650, "Duration cannot exceed 10 years"),
  }),

  limits: z.object({
    messages: z
      .number()
      .min(0, "Messages cannot be negative")
      .max(100000, "Too many messages"),

    consentLetters: z
      .number()
      .min(0, "Consent letters cannot be negative")
      .max(10000, "Too many consent letters"),

    profileBoost: z.enum(["basic", "priority", "premium"]),
  }),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
