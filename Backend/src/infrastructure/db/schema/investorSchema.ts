import { KYCStatus } from "@domain/enum/kycStatus";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";
import { UserRole } from "@domain/enum/userRole";
import { UserStatus } from "@domain/enum/userStatus";
import mongoose from "mongoose";

const investorSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isFirstLogin: { type: Boolean, default: true },
    linkedInUrl: { type: String },
    profileImg: { type: String },
    website: { type: String },
    bio: { type: String },

    interestedTopics: [{ type: String, enum: Object.values(PreferredSector) }],

    role: { type: String, enum: Object.values(UserRole), default: UserRole.INVESTOR },

    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },

    location: { type: String },
    companyName: { type: String },
    experience: { type: Number },

    preferredSector: [{ type: String, enum: Object.values(PreferredSector) }],

    preferredStartupStage: [{ type: String, enum: Object.values(StartupStage) }],

    // NOTE: this only guards against corrupt/negative values (e.g. -10000),
    // not against 0. A freshly-registered investor legitimately has
    // investmentMin/investmentMax = 0 as a "not set yet" sentinel (see
    // InvestorMapper.toEntity) until they complete/update their profile —
    // Mongoose's create() runs validators unconditionally, on every write,
    // so a `> 0` rule here would (and did) reject that legitimate initial
    // state. The stricter "must be greater than 0" business rule belongs to
    // the request/domain layers that only run when the investor is actually
    // submitting a real value — see investorProfileUpdateValidator.ts,
    // investorProfileCompletionValidator.ts, and
    // investorProfileUpdateUseCase.ts.
    investmentMin: {
      type: Number,
      validate: {
        validator: (v: number) => v === null || v === undefined || v >= 0,
        message: "Minimum investment cannot be negative",
      },
    },
    investmentMax: {
      type: Number,
      validate: {
        validator: (v: number) => v === null || v === undefined || v >= 0,
        message: "Maximum investment cannot be negative",
      },
    },

    portfolioPdf: { type: String },

    adminVerified: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    stripeAccountId: { type: String },
    stripeOnboardingComplete: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    kycStatus: { type: String, enum: Object.values(KYCStatus), default: KYCStatus.PENDING },
    kycHistory: [
      {
        status: { type: String, enum: Object.values(KYCStatus) },
        reason: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    kycRejectReason: { type: String },
    aadharImg: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    selfieImg: { type: String },
    verifiedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

investorSchema.index({ userName: 1 });

export default investorSchema;
