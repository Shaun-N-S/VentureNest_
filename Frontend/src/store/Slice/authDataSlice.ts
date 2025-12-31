import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StatusTypes } from "../../types/StatusType";
import type { UserRole } from "../../types/UserRole";

export interface UserAuthData {
  id: string;
  userName: string;
  email: string;
  role: UserRole | null;
  status: StatusTypes | null;
  isFirstLogin: boolean;
  profileImg: string;
  bio: string;
  website: string;
  linkedInUrl: string;
  companyName: string;
  adminVerified: boolean;
  isAuthenticated?: boolean;
  connectionsCount?: number;
  postsCount?: number;
  projectsCount?: number;
  investmentCount?: number;
}

interface UserPayloadFromAPI {
  _id: string;
  userName: string;
  email: string;
  role: UserRole | null;
  status: StatusTypes | null;
  isFirstLogin: boolean;
  profileImg: string;
  bio: string;
  website: string;
  linkedInUrl: string;
  companyName: string;
  adminVerified: boolean;
  isAuthenticated?: boolean;
  connectionsCount?: number;
  postsCount?: number;
  projectsCount?: number;
  investmentCount?: number;
}

const initialState: UserAuthData = {
  id: "",
  userName: "",
  email: "",
  role: null,
  status: null,
  isFirstLogin: false,
  profileImg: "",
  bio: "",
  website: "",
  linkedInUrl: "",
  companyName: "",
  adminVerified: false,
  isAuthenticated: false,
  connectionsCount: 0,
  postsCount: 0,
  projectsCount: 0,
  investmentCount: 0,
};

const AuthDataSlice = createSlice({
  name: "AuthData",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<UserPayloadFromAPI>) => {
      return {
        id: action.payload._id,
        userName: action.payload.userName,
        email: action.payload.email,
        role: action.payload.role,
        status: action.payload.status,
        isFirstLogin: action.payload.isFirstLogin,
        profileImg: action.payload.profileImg,
        bio: action.payload.bio,
        website: action.payload.website,
        linkedInUrl: action.payload.linkedInUrl,
        companyName: action.payload.companyName,
        adminVerified: action.payload.adminVerified,
        connectionsCount: action.payload.connectionsCount ?? 0,
        postsCount: action.payload.postsCount ?? 0,
        projectsCount: action.payload.projectsCount ?? 0,
        investmentCount: action.payload.investmentCount ?? 0,
      };
    },

    updateUserData: (state, action: PayloadAction<Partial<UserAuthData>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    clearData: () => initialState,
  },
});

export const { setData, clearData, updateUserData } = AuthDataSlice.actions;
export default AuthDataSlice.reducer;
