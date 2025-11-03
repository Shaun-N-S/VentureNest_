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
}

interface UserPayloadFromAPI {
  _id: string;
  userName: string;
  email: string;
  role: UserRole | null;
  status: StatusTypes | null;
  isFirstLogin: boolean;
  profileImg: string;
}

const initialState: UserAuthData = {
  id: "",
  userName: "",
  email: "",
  role: null,
  status: null,
  isFirstLogin: true,
  profileImg: "",
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
