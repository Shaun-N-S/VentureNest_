import { useQuery, useMutation } from "@tanstack/react-query";
import {
  adminRemovePost,
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
import toast from "react-hot-toast";
import { queryClient } from "@/main";
import type { AdminPost } from "@/types/adminPostType";

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
      /** Client-only hint for targeted cache invalidation. Not sent to the API. */
      target?: "post" | "project";
      payload: { status: string; actionTaken?: string };
    }) => updateReportStatus(reportId, payload),

    onSuccess: (_data, variables) => {
      // The moderation list rows (reportCount / aggregate status), the pagination
      // total and the modal's per-report list are all server-derived React Query
      // caches — invalidate the affected families so the mounted queries refetch.
      if (variables.target === "post") {
        queryClient.invalidateQueries({ queryKey: ["reported-posts"] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.REPORTED_POST_DETAIL],
        });
      } else if (variables.target === "project") {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.REPORTED_PROJECTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.REPORTED_PROJECT_DETAIL],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["reported-posts"] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.REPORTED_PROJECTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.REPORTED_POST_DETAIL],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.REPORTED_PROJECT_DETAIL],
        });
      }
      toast.success("Report updated");
    },

    onError: () => {
      toast.error("Failed to update report");
    },
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

export const useAdminRemovePost = () => {

  return useMutation({
    mutationFn: (postId: string) => adminRemovePost(postId),

    onSuccess: (data, postId) => {
      queryClient.setQueryData<AdminPost>(["admin-post", postId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          isActive: data.isActive,
        };
      });

      // Keep the moderation list + post report detail in sync when a reported
      // post is blocked/activated from the Content Preview tab.
      queryClient.invalidateQueries({ queryKey: ["reported-posts"] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REPORTED_POST_DETAIL],
      });

      if (data.isActive) {
        toast.success("Post activated successfully");
      } else {
        toast.success("Post blocked successfully");
      }
    },

    onError: () => {
      toast.error("Failed to update post status");
    },
  });
};
