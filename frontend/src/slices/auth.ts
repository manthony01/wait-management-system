import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Account } from "../types";

type AuthState = {
  user: Account | null;
  token: string | null;
};

export const authSlice = createSlice({
  name: "auth",
  initialState: () => {
    return { user: null, token: null } as AuthState;
  },
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, token },
      }: PayloadAction<{ user: Account | null; token: string | null }>
    ) => {
      state.user = user;
      state.token = token;
    },
  },
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;

export const selectCurrentToken = (state: RootState) => state.auth.token;
