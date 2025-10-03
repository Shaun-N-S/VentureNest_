import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface tokenState {
  token: string | null;
}

const initialState: tokenState = {
  token: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    deleteToken: (state) => {
      state.token = null;
    },
  },
});

export const { deleteToken, setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
