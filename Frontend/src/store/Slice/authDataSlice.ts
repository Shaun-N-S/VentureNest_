import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StatusTypes } from "../../types/StatusType";
import type { UserRole } from "../../types/UserRole";

export interface UserAuthData {
  userName: string;
  email: string;
  role: UserRole | null;
  status: StatusTypes | null;
  isFirstLogin: boolean;
  updatedAt: string;
}

const initialState: UserAuthData = {
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
    setData: (state, action: PayloadAction<UserAuthData>) => {
      return { ...action.payload };
    },

    clearData: () => initialState,
  },
});

export const { setData, clearData } = AuthDataSlice.actions;
export default AuthDataSlice.reducer;
