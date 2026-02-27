import AxiosInstance from "../../../axios/axios";
import { API_ROUTES } from "../../../constants/apiRoutes";
import type { AdminPlatformWallet } from "../../../types/adminPlatformWalletType";

export const getAdminPlatformWallet =
  async (): Promise<AdminPlatformWallet> => {
    const response = await AxiosInstance.get(API_ROUTES.ADMIN.PLATFORM_WALLET);

    return response.data.data;
  };
