import { z } from "zod";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";

export const profileCompletionSchema = z
  .object({
    linkedInUrl: z.string().min(1, "LinkedIn URL is required").url("Enter a valid LinkedIn URL"),

    companyName: z
      .string()
      .trim()
      .min(1, "Company name is required")
      .max(100, "Company name cannot exceed 100 characters"),

    experience: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0, "Experience cannot be negative")
    ),

    location: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(100, "Location cannot exceed 100 characters"),

    preferredSector: z
      .array(z.nativeEnum(PreferredSector))
      .nonempty("Select at least one preferred sector"),

    preferredStartupStage: z
      .array(z.nativeEnum(StartupStage))
      .nonempty("Select at least one preferred startup stage"),

    investmentMin: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().positive("Investment minimum must be greater than 0")
    ),

    investmentMax: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().positive("Investment maximum must be greater than 0")
    ),
  })
  .refine((data) => data.investmentMax >= data.investmentMin, {
    message: "Investment maximum must be greater than or equal to minimum",
    path: ["investmentMax"],
  });

export const InvestorProfileCompletionReqSchema = z.object({
  id: z.string().min(1, "Investor ID is required"),
  profileImg: z.any().optional(),
  portfolioPdf: z.any().optional(),
  formData: profileCompletionSchema,
});

export type InvestorProfileCompletionReqType = z.infer<typeof InvestorProfileCompletionReqSchema>;
