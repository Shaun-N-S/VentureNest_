import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export const addProject = async (formData: FormData) => {
  const response = await AxiosInstance.post(API_ROUTES.PROJECT.ADD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProject = async (formData: FormData) => {
  const projectId = formData.get("projectId") as string;
  const response = await AxiosInstance.patch(
    API_ROUTES.PROJECT.UPDATE_PROJECT.replace("projectId", projectId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchPersonalProjects = async (page: number, limit: number) => {
  const response = await AxiosInstance.get(
    API_ROUTES.PROJECT.FETCH_PERSONAL_PROJECT,
    {
      params: { page, limit },
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchAllProjects = async (page: number, limit: number) => {
  const response = await AxiosInstance.get(
    API_ROUTES.PROJECT.FETCH_ALL_PROJECTS,
    {
      params: { page, limit },
      withCredentials: true,
    }
  );
  return response.data.data;
};

export const removeProject = async (projectId: string) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.PROJECT.REMOVE_PROJECT.replace(":projectId", projectId)
  );
  return response.data;
};

export const fetchProjectById = async (projectId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.PROJECT.FETCH_SINGLE_PROJECT.replace(":projectId", projectId)
  );
  return response.data;
};

export const addMontlyProjectReport = async (formData: FormData) => {
  const projectId = formData.get("projectId") as string;
  const response = await AxiosInstance.post(
    API_ROUTES.PROJECT.ADD_MONTHLY_REPORT.replace(":projectId", projectId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const verifyStartup = async (formData: FormData) => {
  const projectId = formData.get("projectId") as string;

  const response = await AxiosInstance.post(
    API_ROUTES.PROJECT.VERIFY_STARTUP.replace(":projectId", projectId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  return response.data;
};
