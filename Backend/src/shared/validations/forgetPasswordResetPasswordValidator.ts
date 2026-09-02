import z from "zod";
import { emailSchema } from "./emailValidator";
import { passwordSchema } from "./loginValidator";

export const forgetPasswordResetPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  token: z.string(),
});
