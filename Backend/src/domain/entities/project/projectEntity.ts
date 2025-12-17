import { PreferredSector } from "@domain/enum/preferredSector";
import { ProjectRole } from "@domain/enum/projectRole";
import { StartupStage } from "@domain/enum/startupStages";
import { TeamSize } from "@domain/enum/teamSize";
import { UserRole } from "@domain/enum/userRole";

export interface ProjectEntity {
  _id?: string;
  userId: string;
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
  likes: { likerId: string; likerRole: UserRole }[];
  likeCount: number;
  isActive: boolean;
  walletId?: string;
  donationEnabled: boolean;
  donationTarget: number;
  donationReceived: number;
  projectRegister: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
