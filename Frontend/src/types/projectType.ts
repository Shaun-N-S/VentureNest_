export interface ProjectType {
  _id: string;

  startupName: string;
  shortDescription: string;

  userRole?: string;
  teamSize?: string;

  category?: string;
  stage?: string;

  location?: string;
  projectWebsite?: string;

  logoUrl?: string;
  coverImageUrl?: string;
  pitchDeckUrl?: string;
  isActive?: boolean;
  likeCount: number;
  liked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalProjectList {
  projects: ProjectType[];
  total: number;
}

export interface PersonalProjectApiResponse {
  data: {
    data: {
      projects: ProjectType[];
      totalProjects: number;
      hasNextPage: boolean;
    };
  };
}

export interface ProjectLikeData {
  projectId: string;
  liked: boolean;
  likeCount: number;
}

export interface ProjectLikeResponse {
  success: boolean;
  message: string;
  data: ProjectLikeData;
}

export interface ProjectsPage {
  projects: ProjectType[];
  totalProjects: number;
  hasNextPage: boolean;
}
