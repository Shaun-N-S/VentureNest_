import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllProjects,
  updateProjectStatus,
} from "../../services/Admin/Project/AdminProjectService";

export const useGetAllProjects = (
  page: number,
  limit: number,
  status?: string,
  stage?: string,
  sector?: string,
  search?: string
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
