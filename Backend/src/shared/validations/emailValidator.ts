import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address");

export type EmailDTO = z.infer<typeof emailSchema>;
