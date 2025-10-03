import z from "zod";

export const otpSchema = z.string().min(6);
