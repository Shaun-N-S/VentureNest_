import { z } from "zod";
import { emailSchema } from "./emailValidator";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(20, "Password cannot exceed 20 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[0-9]/, "Must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Must include at least one symbol");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
