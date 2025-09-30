import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StatusTypes } from "../../../types/StatusType";
import type { UserRole } from "../../../types/UserRole";

export interface UserAuthData {
  userName: string;
  email: string;
  role: UserRole;
  status: StatusTypes;
  isFirstLogin: boolean;
  updatedAt: string;
  accessToken: string;
}

const initialState: UserAuthData = {
  userName: "",
  email: "",
  role: "USER",
  status: "ACTIVE",
  isFirstLogin: true,
  updatedAt: new Date().toISOString(),
  accessToken: "",
};

const userAuthDataSlice = createSlice({
  name: "UserAuthData",
  initialState,
  reducers: {
    // Set all data at once
    setData: (state, action: PayloadAction<UserAuthData>) => {
      return { ...action.payload }; // replace entire state with payload
    },
    // Optionally, clear all data (for logout)
    clearData: () => initialState,
  },
});

export const { setData, clearData } = userAuthDataSlice.actions;
export default userAuthDataSlice.reducer;
