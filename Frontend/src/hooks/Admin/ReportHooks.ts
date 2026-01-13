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
import type { ReportStatus } from "../../types/report";
import type { ReportReason } from "../../types/reportReason";
import type { ReportedPostRow } from "../../pages/Admin/ReportsListingPage";

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export const useGetAllReportedPosts = (params: {
  page: number;
  limit: number;
  status?: ReportStatus;
  reason?: ReportReason;
}) => {
  return useQuery<PaginatedResponse<ReportedPostRow>>({
    queryKey: ["reported-posts", params],
    queryFn: () => getAllReportedPosts(params),
  });
};

export const useGetAllReportedProjects = (params: {
  page: number;
  limit: number;
  status?: string;
  reason?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTED_PROJECTS, params],
    queryFn: () => getAllReportedProjects(params),
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
