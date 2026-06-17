import z from "zod";

export const otpSchema = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits");
