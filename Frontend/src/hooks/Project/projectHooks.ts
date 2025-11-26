import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addProject,
  fetchAllProjects,
  fetchPersonalProjects,
  fetchProjectById,
} from "../../services/Project/projectService";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (formDta: FormData) => addProject(formDta),
  });
};

export const useFetchPersonalProjects = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["personal-project", page, limit],
    queryFn: () => fetchPersonalProjects(page, limit),
  });
};

export const useFetchAllProjects = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["projects", page, limit],
    queryFn: () => fetchAllProjects(page, limit),
  });
};

export const useFetchProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["single-project", projectId],
    queryFn: () => fetchProjectById(projectId),
  });
};
