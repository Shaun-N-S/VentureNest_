import type { ProjectType } from "./projectType";

export interface PersonalProjectApiResponse {
  data: {
    data: {
      projects: ProjectType[];
      totalProjects: number;
      hasNextPage: boolean;
    };
  };
}