import { z } from "zod";
import { ProjectRegistrationStatus } from "@domain/enum/projectRegistrationStatus";

export const CreateProjectRegistrationReqSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  founderId: z.string().min(1, "Founder ID is required"),

  gstCertificate: z.file(),
  companyRegistrationCertificate: z.file(),

  cinNumber: z
    .string()
    .min(21, "CIN must be exactly 21 characters")
    .max(21, "CIN must be exactly 21 characters")
    .optional(),

  country: z.string().min(1, "Country is required"),

  verifyProfile: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === true || val === "true")
    .refine((v) => v === true, { message: "You must verify your profile first" }),

  declarationAccepted: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === true || val === "true")
    .refine((v) => v === true, { message: "Declaration must be accepted" }),

  status: z.enum(Object.values(ProjectRegistrationStatus)).optional(),
});
