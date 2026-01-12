// hooks/Admin/useAdminReports.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllReportedPosts,
  getAllReportedProjects,
  getPostById,
  getProjectById,
  getReportedPost,
  getReportedProject,
  updateReportStatus,
} from "../../services/Admin/Report/AdminReportService";
import { QUERY_KEYS } from "../../constants/queryKey";

export const useGetAllReportedPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTED_POSTS],
    queryFn: getAllReportedPosts,
  });
};

export const useGetAllReportedProjects = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTED_PROJECTS],
    queryFn: getAllReportedProjects,
  });
};

export const useGetReportedPost = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTED_POST_DETAIL, postId],
    queryFn: () => getReportedPost(postId!),
    enabled: !!postId,
  });
};

export const useGetReportedProject = (projectId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTED_PROJECT_DETAIL, projectId],
    queryFn: () => getReportedProject(projectId!),
    enabled: !!projectId,
  });
};

export const useUpdateReportStatus = () => {
  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: {
      reportId: string;
      payload: { status: string; actionTaken?: string };
    }) => updateReportStatus(reportId, payload),
  });
};

export const useGetPostById = (postId?: string, enabled = false) => {
  return useQuery({
    queryKey: ["admin-post", postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId && enabled,
  });
};

export const useGetProjectById = (projectId?: string, enabled = false) => {
  return useQuery({
    queryKey: ["admin-project", projectId],
    queryFn: () => getProjectById(projectId!),
    enabled: !!projectId && enabled,
  });
};
