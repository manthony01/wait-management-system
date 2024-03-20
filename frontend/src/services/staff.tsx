import { waitManagementApi } from "./waitManagement";
import {
  CustomerOrder,
  RequestAssistanceResponse,
  Restaurant,
  CustomerOrderResponse,
} from "../types";
const staffApi = waitManagementApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrdersByStatus: builder.query<
      CustomerOrderResponse[],
      { restaurant_id: number; status: string }
    >({
      query: ({ restaurant_id, status }) =>
        `staff/restaurant/${restaurant_id}/orders?status=${status}`,
      providesTags: ["Order"],
    }),
    getAssistanceRequests: builder.query<
      RequestAssistanceResponse[],
      { restaurant_id: number }
    >({
      query: ({ restaurant_id }) =>
        `staff/restaurant/${restaurant_id}/requests`,
      providesTags: ["RequestAssistance"],
    }),
    updateOrderStatus: builder.mutation<
      CustomerOrder,
      {
        orderstatus: "pending" | "ready" | "served";
        order_id: number;
        menu_id: number;
      }
    >({
      query: ({ order_id, menu_id, ...body }) => ({
        url: `/staff/order/${order_id}/orderItem/${menu_id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    updateAssistanceRequest: builder.mutation<
      RequestAssistanceResponse,
      {
        request_id: number;
      }
    >({
      query: ({ request_id, ...body }) => ({
        url: `/staff/request/${request_id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RequestAssistance"],
    }),
    getOwnedRestaurants: builder.query<
      (Restaurant & { role: string })[],
      unknown
    >({
      query: () => "/staff/restaurants",
      providesTags: ["Restaurant"],
    }),
  }),
});

export const {
  useGetOrdersByStatusQuery,
  useGetAssistanceRequestsQuery,
  useUpdateOrderStatusMutation,
  useUpdateAssistanceRequestMutation,
  useGetOwnedRestaurantsQuery,
} = staffApi;
