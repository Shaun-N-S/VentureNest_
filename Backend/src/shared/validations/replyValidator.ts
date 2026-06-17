import { z } from "zod";

export const ReplySchema = z.object({
  replyText: z
    .string()
    .trim()
    .min(1, "Reply is required")
    .max(500, "Reply cannot exceed 500 characters"),
});
