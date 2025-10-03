import z from "zod";
import { emailSchema } from "./emailValidator";

export const forgetPasswordResetPasswordSchema = z.object({
  email: emailSchema,
  password: z.string().min(6).max(20),
  token: z.string(),
});
