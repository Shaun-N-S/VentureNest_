import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";

export const getAllReportedPosts = async (params: {
  page: number;
  limit: number;
  status?: string;
  reason?: string;
}) => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.REPORTED_POSTS, {
    params,
  });
  return response.data.data;
};

export const getAllReportedProjects = async (params: {
  page: number;
  limit: number;
  status?: string;
  reason?: string;
}) => {
  const response = await AxiosInstance.get(API_ROUTES.ADMIN.REPORTED_PROJECTS, {
    params,
  });

  return response.data.data;
};

export const getReportedPost = async (postId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.ADMIN.REPORTED_POST.replace(":postId", postId)
  );
  return response.data.data;
};

export const getReportedProject = async (projectId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.ADMIN.REPORTED_PROJECT.replace(":projectId", projectId)
  );
  return response.data.data;
};

export const updateReportStatus = async (
  reportId: string,
  payload: {
    status: string;
    actionTaken?: string;
  }
) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ADMIN.UPDATE_REPORT_STATUS.replace(":reportId", reportId),
    payload
  );

  return response.data.data;
};

export const getPostById = async (postId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.ADMIN.POST_BY_ID.replace(":postId", postId)
  );

  return response.data.data;
};

export const getProjectById = async (projectId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.ADMIN.PROJECT_BY_ID.replace(":projectId", projectId)
  );

  return response.data.data;
};
