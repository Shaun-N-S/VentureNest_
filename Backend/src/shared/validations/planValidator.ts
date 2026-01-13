import { z } from "zod";
import { PlanRole } from "@domain/enum/planRole";
import { ProfileBoost } from "@domain/enum/profileBoost";

export const createPlanSchema = z.object({
  name: z.string().min(3),
  role: z.nativeEnum(PlanRole),
  description: z.string().min(10),

  limits: z.object({
    messages: z.number().min(0),
    consentLetters: z.number().min(0),
    profileBoost: z.nativeEnum(ProfileBoost),
  }),

  billing: z.object({
    durationDays: z.number().positive(),
    price: z.number().nonnegative(),
  }),
});
