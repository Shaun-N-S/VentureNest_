import { z } from "zod";

export const pitchFormSchema = z.object({
  projectId: z.string().min(1, "Please select a project"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

export type PitchFormValues = z.infer<typeof pitchFormSchema>;
