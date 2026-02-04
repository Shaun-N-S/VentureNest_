import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../services/User/UserProfileService";
type QueryOptions = {
  enabled?: boolean;
};

export const useFetchUserProfile = (
  id: string,
  queryOptions?: QueryOptions,
) => {
  return useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id),
    enabled: queryOptions?.enabled ?? Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserProfileUpdate = () => {
  return useMutation({
    mutationFn: (formData: FormData) => updateUserProfile(formData),
  });
};
