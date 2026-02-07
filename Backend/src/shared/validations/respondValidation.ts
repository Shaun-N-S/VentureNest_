import { z } from "zod";

export const respondPitchSchema = z.object({
  message: z.string().min(5, "Reply message is too short"),
});
