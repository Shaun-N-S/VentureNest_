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
  updatedAt: string;
}

interface userPayload extends UserAuthData {
  _id: string;
}

const initialState: UserAuthData = {
  id: "",
  userName: "",
  email: "",
  role: null,
  status: null,
  isFirstLogin: true,
  updatedAt: new Date().toISOString(),
};

const AuthDataSlice = createSlice({
  name: "AuthData",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<userPayload>) => {
      
      return {
        email: action.payload.email,
        id: action.payload._id,
        userName: action.payload.userName,
        isFirstLogin: action.payload.isFirstLogin,
        role: action.payload.role,
        status: action.payload.status,
        updatedAt: action.payload.updatedAt,
      };
    },

    clearData: () => initialState,
  },
});

export const { setData, clearData } = AuthDataSlice.actions;
export default AuthDataSlice.reducer;
