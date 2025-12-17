import type { PersonalPost } from "../pages/Investor/Profile/InvestorProfile/ProfilePage";
import type { ProjectType } from "./projectType";

export type PersonalPostCache = {
  data: {
    data: {
      posts: PersonalPost[];
      totalPosts: number;
    };
  };
};

export interface RemoveProjectResponse {
  success: boolean;
  message: string;
  data: {
    projectId: string;
  };
}

export interface PersonalProjectsResponse {
  success: boolean;
  message: string;
  data: {
    data: {
      projects: ProjectType[];
      totalPages: number;
      currentPage: number;
    };
  };
}
