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

  likes?: number;
  liked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalProjectList {
  projects: ProjectType[];
  total: number;
}

export interface PersonalProjectApiResponse {
  success: boolean;
  message: string;
  data: {
    data: PersonalProjectList;
  };
}
