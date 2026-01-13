import { z } from "zod";
import { PlanRole } from "@domain/enum/planRole";
import { ProfileBoost } from "@domain/enum/profileBoost";
import { UpdatePlanStatusDTO } from "application/dto/plan/updatePlanStatusDTO";
import { PlanStatus } from "@domain/enum/planStatus";

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

export const updatePlanSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),

  limits: z
    .object({
      messages: z.number().min(0).optional(),
      consentLetters: z.number().min(0).optional(),
      profileBoost: z.nativeEnum(ProfileBoost).optional(),
    })
    .optional(),

  billing: z
    .object({
      durationDays: z.number().positive().optional(),
      price: z.number().nonnegative().optional(),
    })
    .optional(),
});

export const updatePlanStatusSchema: z.ZodType<UpdatePlanStatusDTO> = z.object({
  status: z.nativeEnum(PlanStatus),
});
