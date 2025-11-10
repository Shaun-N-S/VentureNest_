import { z } from "zod";

export const InvestorKYCSchema = z.object({
  id: z.string().nonempty("Investor ID is required"),

  aadharImg: z.instanceof(File, { message: "Aadhar image is required" }),

  selfieImg: z.instanceof(File, { message: "Selfie image is required" }),

  formData: z.object({
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format for date of birth"),
    phoneNumber: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number format"),
    address: z.string().min(1, "Address is required"),
  }),
});
