import { emailSchema } from "./emailValidator";
import { z } from "zod";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6).max(20),
});
