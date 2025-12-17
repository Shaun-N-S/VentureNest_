import { Document, model, Types } from "mongoose";
import projectSchema from "../schema/projectSchema";
import { PreferredSector } from "@domain/enum/preferredSector";
import { StartupStage } from "@domain/enum/startupStages";
import { TeamSize } from "@domain/enum/teamSize";
import { ProjectRole } from "@domain/enum/projectRole";
import { UserRole } from "@domain/enum/userRole";

export interface IProjectModel extends Document {
  userId: Types.ObjectId;
  startupName: string;
  shortDescription: string;
  pitchDeckUrl?: string;
  projectWebsite?: string;
  userRole: ProjectRole;
  teamSize: TeamSize;
  category: PreferredSector;
  stage: StartupStage;
  logoUrl?: string;
  coverImageUrl?: string;
  location?: string;
  likes: {
    likerId: Types.ObjectId;
    likerRole: UserRole;
  }[];
  likeCount: number;
  isActive: boolean;
  walletId?: Types.ObjectId;
  donationEnabled: boolean;
  donationTarget: number;
  donationReceived: number;
  projectRegister: boolean;
}

export const projectModel = model<IProjectModel>("Project", projectSchema);
