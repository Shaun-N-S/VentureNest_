import z from "zod";

export const cancelSessionSchema = z.object({
  reason: z.string().min(5).max(300),
});
