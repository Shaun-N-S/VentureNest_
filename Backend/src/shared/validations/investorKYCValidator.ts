import { z } from "zod";

export const InvestorKYCSchema = z.object({
  id: z.string().nonempty("Investor ID is required"),

  aadharImg: z
    .any()
    .refine(
      (file) => file && typeof file === "object" && "originalname" in file,
      "Aadhar image is required and must be a valid file"
    ),

  selfieImg: z
    .any()
    .refine(
      (file) => file && typeof file === "object" && "originalname" in file,
      "Selfie image is required and must be a valid file"
    ),

  formData: z.object({
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date format for date of birth"),
    phoneNumber: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number format"),
    address: z.string().min(1, "Address is required"),
  }),
});
