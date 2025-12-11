import { PreferredSector } from "@domain/enum/preferredSector";
import { ProjectRole } from "@domain/enum/projectRole";
import { StartupStage } from "@domain/enum/startupStages";
import { TeamSize } from "@domain/enum/teamSize";

export interface ProjectResDTO {
  _id: string;
  userId: string;
  user?: {
    userName: string;
    profileImg: string | null;
  };
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
  likes: string[];
  likeCount: number;
  isActive: boolean;
  walletId?: string;
  donationEnabled: boolean;
  donationTarget: number;
  donationReceived: number;
  projectRegister: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  userId: string;
  startupName: string;
  shortDescription: string;
  pitchDeckUrl?: File | undefined;
  projectWebsite?: string | undefined;
  userRole: ProjectRole;
  teamSize: TeamSize;
  category: PreferredSector;
  stage: StartupStage;
  logoUrl?: File | undefined;
  coverImageUrl?: File | undefined;
  location?: string | undefined;
  donationEnabled?: boolean | undefined;
  donationTarget?: number | undefined;
  projectRegister?: boolean | undefined;
}

export interface CreateProjectEntityDTO {
  userId: string;
  startupName: string;
  shortDescription: string;

  pitchDeckUrl?: string | undefined;
  projectWebsite?: string | undefined;

  userRole: ProjectRole;
  teamSize: TeamSize;
  category: PreferredSector;
  stage: StartupStage;

  logoUrl?: string | undefined;
  coverImageUrl?: string | undefined;
  location?: string | undefined;

  donationEnabled?: boolean | undefined;
  donationTarget?: number | undefined;
  projectRegister?: boolean | undefined;
}

export interface UpdateProjectDTO {
  projectId: string;
  userId: string;

  startupName?: string | undefined;
  shortDescription?: string | undefined;
  projectWebsite?: string | undefined;

  userRole?: ProjectRole | undefined;
  teamSize?: TeamSize | undefined;
  category?: PreferredSector | undefined;
  stage?: StartupStage | undefined;

  location?: string | undefined;

  pitchDeckUrl?: File | undefined;
  logoUrl?: File | undefined;
  coverImageUrl?: File | undefined;

  donationEnabled?: boolean | undefined;
  donationTarget?: number | undefined;
  projectRegister?: boolean | undefined;
}

export interface UpdateProjectEntityDTO {
  projectId: string;

  startupName?: string | undefined;
  shortDescription?: string | undefined;
  projectWebsite?: string | undefined;

  userRole?: ProjectRole | undefined;
  teamSize?: TeamSize | undefined;
  category?: PreferredSector | undefined;
  stage?: StartupStage | undefined;

  location?: string | undefined;

  pitchDeckUrl?: string | undefined;
  logoUrl?: string | undefined;
  coverImageUrl?: string | undefined;

  donationEnabled?: boolean | undefined;
  donationTarget?: number | undefined;
  projectRegister?: boolean | undefined;
}

export interface PopulatedUserStub {
  _id: string;
  userName: string;
  profileImg: string | null;
}

export interface PopulatedProjectRepoDTO {
  _id: string;
  userId: string;
  populatedUser?: PopulatedUserStub;
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
  likes: string[];
  likeCount: number;
  isActive: boolean;
  walletId?: string;
  donationEnabled: boolean;
  donationTarget: number;
  donationReceived: number;
  projectRegister: boolean;
  createdAt: Date;
  updatedAt: Date;
}
