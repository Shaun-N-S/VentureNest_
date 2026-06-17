import { z } from "zod";
import { passwordSchema } from "./loginValidator";

export const changePasswordSchema = z.object({
  password: passwordSchema,
  token: z.string().min(1, "Token is required"),
});
