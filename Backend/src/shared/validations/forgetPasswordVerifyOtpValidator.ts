import z from "zod";
import { emailSchema } from "./emailValidator";
import { otpSchema } from "./otpValidator";

export const forgetPasswordVerifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});
