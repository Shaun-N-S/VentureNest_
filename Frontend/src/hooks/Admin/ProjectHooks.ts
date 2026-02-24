import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllProjectRegistrations,
  getAllProjects,
  updateProjectRegistrationStatus,
  updateProjectStatus,
  type UpdateProjectRegistrationStatusPayload,
} from "../../services/Admin/Project/AdminProjectService";
import { queryClient } from "../../main";
import type { ProjectRegistrationStatus } from "../../types/projectRegistrationStatus";

export const useGetAllProjects = (
  page: number,
  limit: number,
  status?: string,
  stage?: string,
  sector?: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ["admin-projects", page, limit, status, stage, sector, search],
    queryFn: () => getAllProjects(page, limit, status, stage, sector, search),
  });
};

export const useUpdateProjectStatus = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      currentStatus,
    }: {
      projectId: string;
      currentStatus: string;
    }) => updateProjectStatus({ projectId, currentStatus }),
  });
};

export const useGetAllProjectRegistrations = (
  page: number,
  limit: number,
  status?: ProjectRegistrationStatus,
) => {
  return useQuery({
    queryKey: ["admin-project-registrations", page, limit, status],
    queryFn: () => getAllProjectRegistrations(page, limit, status),
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateProjectRegistrationStatus = () => {
  return useMutation({
    mutationFn: (payload: UpdateProjectRegistrationStatusPayload) =>
      updateProjectRegistrationStatus(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-project-registrations"],
      });
    },
  });
};
