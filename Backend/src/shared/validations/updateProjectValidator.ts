import { z } from "zod";
import { ProjectRole } from "@domain/enum/projectRole";
import { TeamSize } from "@domain/enum/teamSize";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";

export const UpdateProjectReqSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  userId: z.string().min(1, "User ID is required"),

  startupName: z.string().optional(),

  shortDescription: z.string().max(200, "Description must not exceed 200 characters").optional(),

  projectWebsite: z.string().optional(),

  userRole: z.enum(Object.values(ProjectRole)).optional(),

  teamSize: z.enum(Object.values(TeamSize)).optional(),

  category: z.enum(Object.values(PreferredSector)).optional(),

  stage: z.enum(Object.values(StartupStage)).optional(),

  location: z.string().optional(),

  donationEnabled: z.boolean().optional(),

  donationTarget: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number()).optional(),

  projectRegister: z.boolean().optional(),

  // File uploads (optional)
  pitchDeckUrl: z.any().optional(),
  logoUrl: z.any().optional(),
  coverImageUrl: z.any().optional(),
});
