import qs from "qs";
import { tags, waitManagementApi } from "./waitManagement";
import {
  Account,
  CreateAccountRequest,
  LoginRequest,
  LoginResponse,
} from "../types";

const authApi = waitManagementApi.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation<Account, CreateAccountRequest>({
      query: (body) => ({
        url: "/createAccount",
        method: "POST",
        body: body,
      }),
      invalidatesTags: tags,
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: `/token`,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: qs.stringify(credentials),
      }),
      invalidatesTags: tags,
    }),
  }),
});

export const { useCreateAccountMutation, useLoginMutation } = authApi;
