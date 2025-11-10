import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../services/User/UserProfileService";

export const useFetchUserProfile = (id: string) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserProfileUpdate = () => {
  return useMutation({
    mutationFn: (formData: FormData) => updateUserProfile(formData),
  });
};
