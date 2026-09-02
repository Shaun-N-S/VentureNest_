import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  addMontlyProjectReport,
  addProject,
  fetchAllProjects,
  fetchPersonalProjects,
  fetchPersonalProjectsById,
  fetchProjectById,
  fetchProjectInvestors,
  likeProject,
  removeProject,
  updateProject,
  verifyStartup,
} from "../../services/Project/projectService";
import type {
  PersonalProjectApiResponse,
  ProjectLikeResponse,
  ProjectsPage,
} from "../../types/projectType";
import type { ProjectInvestorsResponse } from "../../types/projectInvestorType";
import { QUERY_KEYS } from "../../constants/queryKey";

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

export const useFetchPersonalProjects = (
  page: number,
  limit: number,
  enabled = true,
) => {
  return useQuery<PersonalProjectApiResponse>({
    queryKey: ["personal-project", page, limit],
    queryFn: () => fetchPersonalProjects(page, limit),
    enabled,
  });
};

export const useFetchPersonalProjectsById = (
  userId: string,
  page: number,
  limit: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["personal-project-by-id", userId, page, limit],
    queryFn: () => fetchPersonalProjectsById(userId, page, limit),
    enabled,
  });
};

export const useInfiniteProjects = (
  limit: number,
  search?: string,
  stage?: string,
  sector?: string,
) => {
  return useInfiniteQuery<ProjectsPage>({
    queryKey: ["projects", limit, search, stage, sector],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      fetchAllProjects(pageParam as number, limit, search, stage, sector),

    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,

    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useFetchProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["single-project", projectId],
    queryFn: () => fetchProjectById(projectId),
  });
};

export const useProjectInvestors = (
  projectId: string,
  page: number,
  limit = 5,
  enabled = true,
) => {
  return useQuery<ProjectInvestorsResponse>({
    queryKey: [QUERY_KEYS.PROJECT_INVESTORS, projectId, page, limit],
    queryFn: () => fetchProjectInvestors(projectId, page, limit),
    enabled: enabled && Boolean(projectId),
  });
};

/**
 * Infinite-scroll variant for the investor list modal — same endpoint / pagination
 * as `useProjectInvestors`, with server-side `search`. A search change resets to
 * page 1 (queryKey includes the term); pages are appended, deduped by the server.
 */
export const useInfiniteProjectInvestors = (
  projectId: string,
  limit = 10,
  enabled = true,
  search = "",
) => {
  return useInfiniteQuery<ProjectInvestorsResponse>({
    queryKey: [QUERY_KEYS.PROJECT_INVESTORS, "infinite", projectId, limit, search],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchProjectInvestors(projectId, pageParam as number, limit, search),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    enabled: enabled && Boolean(projectId),
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
