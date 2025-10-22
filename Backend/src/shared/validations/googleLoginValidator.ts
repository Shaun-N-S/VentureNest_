import { UserRole } from "@domain/enum/userRole";
import { Errors } from "@shared/constants/error";
import z from "zod";

export const googleLoginSchema = z.object({
  authorizationCode: z.string({ error: Errors.AUTHENTICATION_CODE_MISSING }),
  role: z
    .enum(UserRole, {
      error: Errors.INVALID_ROLE,
    })
    .refine((role) => role !== UserRole.ADMIN, {
      error: "admin signup error",
    }),
});
