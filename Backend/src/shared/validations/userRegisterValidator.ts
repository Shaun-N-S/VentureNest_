import z from "zod";
import { emailSchema } from "./emailValidator";
import { UserRole } from "@domain/enum/userRole";

export const registerUserSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: emailSchema,
  password: z.string().min(6).max(20),
  otp: z.string().min(6),
  //   role: z.enum(UserRole),
});
