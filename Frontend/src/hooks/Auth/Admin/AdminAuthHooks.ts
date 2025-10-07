import { useMutation } from "@tanstack/react-query";
import type { LoginPayload } from "../../../types/AuthPayloads";
import { adminLogin } from "../../../services/Auth/Admin/AdminAuthServices";

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => adminLogin(data),
  });
};
