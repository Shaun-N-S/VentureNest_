import { z } from "zod";
import { PreferredSector } from "@domain/enum/preferredSector";

export const interestedTopicsSchema = z.object({
  interestedTopics: z
    .array(z.nativeEnum(PreferredSector))
    .length(4, "Please select exactly 4 topics")
    .refine((topics) => new Set(topics).size === topics.length, {
      message: "Duplicate topics are not allowed",
    }),
});
