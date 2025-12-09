import { object, z } from "zod";
import { ProjectRole } from "@domain/enum/projectRole";
import { TeamSize } from "@domain/enum/teamSize";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";

export const CreateProjectReqSchema = z.object({
  userId: z.string().min(1, "User ID is required"),

  startupName: z.string().min(1, "Startup name is required"),

  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(200, "Description must not exceed 200 characters"),

  projectWebsite: z.string().optional(),

  userRole: z.enum(Object.values(ProjectRole)),

  teamSize: z.enum(Object.values(TeamSize)),

  category: z.enum(Object.values(PreferredSector)),

  stage: z.enum(Object.values(StartupStage)),

  location: z.string().min(1, "Location is required"),

  donationEnabled: z.boolean().optional(),

  donationTarget: z
    .preprocess(
      (v) => (v === "" ? undefined : Number(v)),
      z.number().min(0, "Donation target cannot be negative")
    )
    .optional(),

  projectRegister: z.boolean().optional(),

  // Files
  pitchDeckUrl: z.any().optional(),
  logoUrl: z.any().optional(),
  coverImageUrl: z.any().optional(),
});
