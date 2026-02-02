import AxiosInstance from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import { type ApiResponse } from "../../types/apiResponseType";
import type { ConnectionsPeopleResponse } from "../../types/ConnectionsPeopleResponseType";
import type { NetworkUser } from "../../types/networkType";

export interface GetNetworkUsersResponse {
  data: {
    users: NetworkUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  };
}

export const getNetworkUsers = async (
  page: number,
  limit: number,
  search?: string,
) => {
  const response = await AxiosInstance.get<
    ApiResponse<GetNetworkUsersResponse>
  >(API_ROUTES.RELATIONSHIP.GET_NETWORK_USERS, {
    params: { page, limit, search },
    withCredentials: true,
  });
  return response.data.data;
};

export const sendConnectionReq = async (toUserId: string) => {
  const response = await AxiosInstance.post(
    API_ROUTES.RELATIONSHIP.CONNECTION_REQ.replace(":toUserId", toUserId),
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const getConnectionReq = async (page: number, limit: number) => {
  const response = await AxiosInstance.get(
    API_ROUTES.RELATIONSHIP.GET_PERSONAL_CONNECTION_REQ,
    {
      params: { page, limit },
      withCredentials: true,
    },
  );

  return response.data;
};

export const updateConnectionReqStatus = async (
  fromUserId: string,
  status: string,
) => {
  const response = await AxiosInstance.patch(
    `${API_ROUTES.RELATIONSHIP.CONNECTION_STATUS_UPDATE}/${fromUserId}/${status}`,
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const getConnectionsPeopleList = async (
  page: number,
  limit: number,
  search?: string,
): Promise<ConnectionsPeopleResponse> => {
  const response = await AxiosInstance.get<
    ApiResponse<ConnectionsPeopleResponse>
  >(API_ROUTES.RELATIONSHIP.GET_CONNECTIONS_PEOPLE, {
    params: { page, limit, search },
    withCredentials: true,
  });

  return response.data.data;
};

export const removeConnection = async (userId: string) => {
  const response = await AxiosInstance.delete(
    API_ROUTES.RELATIONSHIP.REMOVE_CONNECTION.replace(":userId", userId),
    { withCredentials: true },
  );
  return response.data;
};
