import z from "zod";
import { emailSchema } from "./emailValidator";

export const registerUserSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: emailSchema,
  password: z.string().min(6).max(20),
  //   role: z.enum(UserRole),
});

export const redisRegisterSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: emailSchema,
  password: z.string(),
  //   role: z.enum(UserRole),
});
