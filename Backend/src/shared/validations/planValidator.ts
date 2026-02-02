import { z } from "zod";
import { PlanRole } from "@domain/enum/planRole";
import { UpdatePlanStatusDTO } from "application/dto/plan/updatePlanStatusDTO";
import { PlanStatus } from "@domain/enum/planStatus";

/**
 * CREATE PLAN
 * - Defaults ensure DTO compatibility
 * - No optional number outputs
 * - Role-based permission validation
 */
export const createPlanSchema = z
  .object({
    name: z.string().min(3),
    role: z.nativeEnum(PlanRole),
    description: z.string().min(10),

    limits: z.object({
      projects: z.number().min(0).default(0),
      proposalsPerMonth: z.number().min(0).default(0),
      meetingRequests: z.number().min(0).default(0),

      investmentOffers: z.number().min(0).default(0),
      activeInvestments: z.number().min(0).default(0),
    }),

    permissions: z.object({
      canCreateProject: z.boolean(),
      canSendProposal: z.boolean(),
      canRequestMeeting: z.boolean(),

      canSendInvestmentOffer: z.boolean(),
      canInvestMoney: z.boolean(),
      canViewInvestmentDashboard: z.boolean(),
    }),

    billing: z.object({
      durationDays: z.number().positive(),
      price: z.number().nonnegative(),
    }),
  })
  .refine(
    (data) =>
      data.role === PlanRole.USER
        ? !data.permissions.canInvestMoney && !data.permissions.canSendInvestmentOffer
        : true,
    {
      message: "USER plans cannot invest or send investment offers",
      path: ["permissions"],
    }
  );

/**
 * UPDATE PLAN
 * - Partial updates allowed
 * - No defaults here (patch semantics)
 */
export const updatePlanSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),

  limits: z
    .object({
      projects: z.number().min(0).optional(),
      proposalsPerMonth: z.number().min(0).optional(),
      meetingRequests: z.number().min(0).optional(),

      investmentOffers: z.number().min(0).optional(),
      activeInvestments: z.number().min(0).optional(),
    })
    .optional(),

  permissions: z
    .object({
      canCreateProject: z.boolean().optional(),
      canSendProposal: z.boolean().optional(),
      canRequestMeeting: z.boolean().optional(),

      canSendInvestmentOffer: z.boolean().optional(),
      canInvestMoney: z.boolean().optional(),
      canViewInvestmentDashboard: z.boolean().optional(),
    })
    .optional(),

  billing: z
    .object({
      durationDays: z.number().positive().optional(),
      price: z.number().nonnegative().optional(),
    })
    .optional(),
});

/**
 * UPDATE PLAN STATUS
 */
export const updatePlanStatusSchema: z.ZodType<UpdatePlanStatusDTO> = z.object({
  status: z.nativeEnum(PlanStatus),
});
