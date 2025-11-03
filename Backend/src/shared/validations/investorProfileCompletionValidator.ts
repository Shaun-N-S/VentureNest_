import { z } from "zod";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";

export const profileCompletionSchema = z
  .object({
    linkedInUrl: z.string().min(1, "LinkedIn URL is required").url("Enter a valid LinkedIn URL"),

    companyName: z.string().min(1, "Company name is required"),

    experience: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0, "Experience cannot be negative")
    ),

    location: z.string().min(1, "Location is required"),

    preferredSector: z
      .array(z.nativeEnum(PreferredSector))
      .nonempty("Select at least one preferred sector"),

    preferredStartupStage: z
      .array(z.nativeEnum(StartupStage))
      .nonempty("Select at least one preferred startup stage"),

    investmentMin: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0, "Investment minimum cannot be negative")
    ),

    investmentMax: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(0, "Investment maximum cannot be negative")
    ),
  })
  .refine((data) => data.investmentMin <= data.investmentMax, {
    message: "Investment minimum cannot be greater than maximum",
    path: ["investmentMin"],
  });

export const InvestorProfileCompletionReqSchema = z.object({
  id: z.string().min(1, "Investor ID is required"),
  profileImg: z.any().optional(),
  portfolioPdf: z.any().optional(),
  formData: profileCompletionSchema,
});

export type InvestorProfileCompletionReqType = z.infer<typeof InvestorProfileCompletionReqSchema>;
