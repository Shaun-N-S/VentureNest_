import { z } from "zod";
import { PlanRole } from "@domain/enum/planRole";
import { UpdatePlanStatusDTO } from "application/dto/plan/updatePlanStatusDTO";
import { PlanStatus } from "@domain/enum/planStatus";
import { UNLIMITED } from "@shared/constants/plan";

/**
 * A plan limit: the UNLIMITED sentinel (-1) or a non-negative integer.
 * `.int()` rejects fractional values; `.min(UNLIMITED)` rejects anything below -1.
 */
const limitValue = z.number().int().min(UNLIMITED);

/**
 * CREATE PLAN
 */
export const createPlanSchema = z
  .object({
    name: z.string().min(3),
    role: z.nativeEnum(PlanRole),
    description: z.string().min(10),

    limits: z.object({
      projects: limitValue.default(UNLIMITED),
      proposalsPerMonth: limitValue.default(UNLIMITED),
      investmentOffers: limitValue.default(UNLIMITED),
    }),

    permissions: z.object({
      // USER
      canCreateProject: z.boolean(),
      canSendProposal: z.boolean(),

      // INVESTOR
      canSendInvestmentOffer: z.boolean(),
      canInvestMoney: z.boolean(),
      canViewInvestmentDashboard: z.boolean(),

      // COMMON
      canStartVideoCall: z.boolean(),
    }),

    billing: z.object({
      durationDays: z.number().positive(),
      price: z.number().nonnegative(),
    }),
  })

  /**
   * USER cannot have investor permissions
   */
  .refine(
    (data) =>
      data.role === PlanRole.USER
        ? !data.permissions.canSendInvestmentOffer &&
          !data.permissions.canInvestMoney &&
          !data.permissions.canViewInvestmentDashboard
        : true,
    {
      message: "USER plans cannot have investor permissions",
      path: ["permissions"],
    }
  )

  /**
   * INVESTOR cannot create projects
   */
  .refine((data) => (data.role === PlanRole.INVESTOR ? !data.permissions.canCreateProject : true), {
    message: "INVESTOR cannot create projects",
    path: ["permissions"],
  });

/**
 * UPDATE PLAN
 */
export const updatePlanSchema = z
  .object({
    name: z.string().min(3).optional(),
    description: z.string().min(10).optional(),

    limits: z
      .object({
        projects: limitValue.optional(),
        proposalsPerMonth: limitValue.optional(),
        investmentOffers: limitValue.optional(),
      })
      .optional(),

    permissions: z
      .object({
        canCreateProject: z.boolean().optional(),
        canSendProposal: z.boolean().optional(),

        canSendInvestmentOffer: z.boolean().optional(),
        canInvestMoney: z.boolean().optional(),
        canViewInvestmentDashboard: z.boolean().optional(),

        canStartVideoCall: z.boolean().optional(),
      })
      .optional(),

    billing: z
      .object({
        durationDays: z.number().positive().optional(),
        price: z.number().nonnegative().optional(),
      })
      .optional(),
  })

  /**
   * Prevent empty updates
   */
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  });

/**
 * UPDATE PLAN STATUS
 */
export const updatePlanStatusSchema: z.ZodType<UpdatePlanStatusDTO> = z.object({
  status: z.nativeEnum(PlanStatus),
});
