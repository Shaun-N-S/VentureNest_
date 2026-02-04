import { z } from "zod";

export const createPitchSchema = z.object({
  projectId: z.string().min(1),
  investorId: z.string().min(1),
  subject: z.string().min(3),
  message: z.string().min(10),
});
