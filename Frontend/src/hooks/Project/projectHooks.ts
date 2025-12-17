import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addMontlyProjectReport,
  addProject,
  fetchAllProjects,
  fetchPersonalProjects,
  fetchProjectById,
  likeProject,
  removeProject,
  updateProject,
  verifyStartup,
} from "../../services/Project/projectService";
import type { ProjectLikeResponse } from "../../types/projectType";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (formDta: FormData) => addProject(formDta),
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: (formData: FormData) => updateProject(formData),
  });
};

export const useFetchPersonalProjects = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["personal-project", page, limit],
    queryFn: () => fetchPersonalProjects(page, limit),
  });
};

export const useFetchAllProjects = (
  page: number,
  limit: number,
  search?: string,
  stage?: string,
  sector?: string
) => {
  return useQuery({
    queryKey: ["projects", page, limit, search, stage, sector],
    queryFn: () => fetchAllProjects(page, limit, search, stage, sector),
  });
};

export const useFetchProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["single-project", projectId],
    queryFn: () => fetchProjectById(projectId),
  });
};

export const useAddMonthlyReport = () => {
  return useMutation({
    mutationFn: (formData: FormData) => addMontlyProjectReport(formData),
  });
};

export const useVerifyProject = () => {
  return useMutation({
    mutationFn: (formData: FormData) => verifyStartup(formData),
  });
};

export const useRemoveProject = () => {
  return useMutation({
    mutationFn: (projectId: string) => removeProject(projectId),
  });
};

export const useLikeProject = () => {
  return useMutation<ProjectLikeResponse, Error, string>({
    mutationFn: (projectId: string) => likeProject(projectId),
  });
};
