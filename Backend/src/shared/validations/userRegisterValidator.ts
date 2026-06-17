import z from "zod";
import { emailSchema } from "./emailValidator";
import { passwordSchema } from "./loginValidator";

export const registerUserSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),
  email: emailSchema,
  password: passwordSchema,
  //   role: z.enum(UserRole),
});

export const redisRegisterSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),
  email: emailSchema,

  // hashed password
  password: z.string().min(1),
});
