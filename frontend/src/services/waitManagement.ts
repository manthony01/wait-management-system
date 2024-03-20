import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";

export const tags: readonly string[] = [
  "Restaurant",
  "MenuItems",
  "Order",
  "RequestAssistance",
  "Account",
  "Loyalty",
];

export const waitManagementApi = createApi({
  reducerPath: "waitManagementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const { token } = (getState() as RootState).auth;
      if (token && endpoint !== "uploadFile") {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: tags,
  endpoints: () => ({}),
});
