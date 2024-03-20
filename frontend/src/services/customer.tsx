import { waitManagementApi } from "./waitManagement";
import {
  CustomerOrderRequest,
  CustomerOrderResponse,
  LoyaltyProgram,
  MenuItem,
  RequestAssistance,
  RequestAssistanceResponse,
  Restaurant,
  RestaurantMenu,
  RestaurantTable,
  Tag,
  UserPoints,
} from "../types";

const customerApi = waitManagementApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurant: builder.query<Restaurant, number>({
      query: (restaurant_id) => `restaurant/${restaurant_id}`,
      transformResponse: (response: Restaurant) => {
        response.categories.sort((a, b) => {
          if (a.orderindex < b.orderindex) return -1;
          if (a.orderindex > b.orderindex) return 1;
          return 0;
        });
        return response;
      },
      providesTags: (result) => [{ type: "Restaurant", id: result?.id }],
    }),
    getRestaurantMenu: builder.query<RestaurantMenu, number>({
      query: (restaurant_id) => `restaurant/${restaurant_id}/menu`,
      transformResponse: (response: RestaurantMenu) => response,
      providesTags: (_result, _error, id) => [{ type: "Restaurant", id }],
    }),
    getRestaurants: builder.query<Restaurant[], unknown>({
      query: () => `restaurants`,
      providesTags: ["Restaurant"],
    }),
    getRestaurantTables: builder.query<RestaurantTable[], number>({
      query: (id) => `restaurant/${id}/tables`,
      providesTags: ["Restaurant"],
      transformResponse: (response: RestaurantTable[]) => {
        response.sort((a, b) => a.tableid - b.tableid);
        return response;
      },
    }),
    getMenuItem: builder.query<MenuItem, number>({
      query: (id) => `/menuItem/${id}`,
      providesTags: ["MenuItems", "Order"],
    }),
    getMenuItems: builder.query<MenuItem[], number[]>({
      query: (menuIds) => {
        let uri = "menuItems";
        if (menuIds.length > 0) {
          uri += "?";
          menuIds.forEach((menuId) => {
            uri += `menuid=${menuId}`;
            uri += "&";
          });
          uri = uri.substring(0, uri.length - 1);
        }
        return uri;
      },
      providesTags: ["Restaurant", "MenuItems"],
    }),
    createOrder: builder.mutation<CustomerOrderResponse, CustomerOrderRequest>({
      query: ({ ...body }) => ({
        url: "/customer/order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Loyalty"],
    }),
    requestAssistance: builder.mutation<
      RequestAssistanceResponse,
      RequestAssistance
    >({
      query: ({ ...body }) => ({
        url: "/customer/request-assistance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RequestAssistance"],
    }),
    getOrder: builder.query<CustomerOrderResponse, number>({
      query: (id) => `/staff/order/${id}`,
      providesTags: (response) => [{ type: "Order", id: response?.id }],
    }),
    getOrders: builder.query<CustomerOrderResponse[], string | undefined>({
      query: (status) => {
        if (status) {
          return `/customer/orders?status=${status}`;
        } else {
          return `/customer/orders`;
        }
      },
      providesTags: () => ["Order"],
    }),
    getTags: builder.query<Tag[], unknown>({
      query: () => `/tags`,
    }),
    getRestaurantLoyaltyProgram: builder.query<LoyaltyProgram, number>({
      query: (restaurant_id) => `/restaurant/${restaurant_id}/loyalty`,
      providesTags: () => ["Loyalty"],
    }),
    getLoyaltyPoints: builder.query<UserPoints, number>({
      query: (restaurant_id) => `/customer/points/${restaurant_id}`,
      providesTags: () => ["Loyalty"],
    }),
    applyUserPoints: builder.mutation<UserPoints, number>({
      query: (restaurant_id) => ({
        url: `/customer/points/${restaurant_id}`,
        method: "POST",
      }),
      invalidatesTags: () => ["Loyalty", "Order"],
    }),
    getOrderCost: builder.query<number, number>({
      query: (orderId) => `/customer/order/${orderId}/cost`,
      providesTags: () => ["Order"],
    }),
  }),
});

export const {
  useGetRestaurantQuery,
  useGetRestaurantMenuQuery,
  useGetRestaurantsQuery,
  useGetMenuItemsQuery,
  useLazyGetMenuItemsQuery,
  useGetMenuItemQuery,
  useCreateOrderMutation,
  useGetRestaurantTablesQuery,
  useRequestAssistanceMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetTagsQuery,
  useGetRestaurantLoyaltyProgramQuery,
  useGetLoyaltyPointsQuery,
  useApplyUserPointsMutation,
  useGetOrderCostQuery,
} = customerApi;
