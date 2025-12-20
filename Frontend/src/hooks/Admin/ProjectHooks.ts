import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllProjects,
  updateProjectStatus,
} from "../../services/Admin/Project/AdminProjectService";

export const useGetAllProjects = (
  page: number,
  limit: number,
  status?: string,
  stage?: string[],
  search?: string
) => {
  return useQuery({
    queryKey: ["admin-projects", page, limit, status, stage, search],
    queryFn: () => getAllProjects(page, limit, status, stage, search),
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
